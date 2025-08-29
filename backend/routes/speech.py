import os
import requests
import tempfile
from flask import Blueprint, request, jsonify
import assemblyai as aai

speech_bp = Blueprint('speech', __name__)

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
MURFAI_API_KEY = os.getenv("MURFAI_API_KEY")

# Set AssemblyAI key
aai.settings.api_key = ASSEMBLYAI_API_KEY


def generate_response_with_groq(command_text: str) -> str:
    url = 'https://api.groq.com/openai/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': 'llama3-8b-8192',
        'messages': [
            {
                'role': 'system',
                'content': (
                    "You are a helpful assistant that generates short confirmation replies "
                    "based on user commands. Keep it friendly, natural, and avoid repeating the input verbatim."
                )
            },
            {
                'role': 'user',
                'content': f'User command: "{command_text}"\nReply with a friendly confirmation.'
            }
        ],
        'max_tokens': 60,
        'temperature': 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.ok:
            return response.json()['choices'][0]['message']['content'].strip()
        else:
            print('Groq API error:', response.status_code, response.text)
            return f"You said: {command_text}"
    except Exception as e:
        print('Groq Exception:', e)
        return f"You said: {command_text}"


@speech_bp.route('/stt', methods=['POST'])
def speech_to_text():
    if not ASSEMBLYAI_API_KEY:
        return jsonify({'error': 'ASSEMBLYAI_API_KEY not configured'}), 500
    if 'audio' not in request.files:
        return jsonify({'error': 'Audio file is required'}), 400

    audio_file = request.files['audio']
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name

        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(temp_path)

        print("Transcript status:", transcript.status)
        if transcript.status == aai.TranscriptStatus.error:
            return jsonify({'error': transcript.error}), 500

        user_text = transcript.text.strip()
        print("User said:", user_text)

        # NLP parse
        from src.nlp_utils import parse_command
        parsed_command = parse_command(user_text)
        print("Parsed command:", parsed_command)

        # Generate smart reply with Groq
        reply = generate_response_with_groq(user_text)
        print("Generated response:", reply)

        # Generate TTS audio from reply
        tts_audio = generate_tts_audio(reply)
        if not tts_audio:
            return jsonify({'error': 'Failed to synthesize speech'}), 500

        # Return both parsed command and audio (base64)
        import base64
        audio_b64 = base64.b64encode(tts_audio).decode('utf-8')
        return jsonify({
            'transcript': user_text,
            'command': parsed_command,
            'reply': reply,
            'audio': audio_b64
        }), 200

    except Exception as e:
        print("STT Exception:", e)
        return jsonify({'error': f'Failed to process audio: {str(e)}'}), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


def generate_tts_audio(text: str):
    if not MURFAI_API_KEY:
        print("MURFAI_API_KEY not set.")
        return None

    url = 'https://api.murf.ai/v1/speech/generate'
    headers = {
        'api-key': MURFAI_API_KEY,
        'Content-Type': 'application/json'
    }
    payload = {
        'text': text,
        'voice_id': 'en-IN-isha',  # Indian English voice
        'format': 'mp3'
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            print("MurfAI TTS error:", response.text)
            return None

        result = response.json()
        audio_url = result.get('audioFile')
        if not audio_url:
            print("MurfAI: No audioFile returned")
            return None

        audio_response = requests.get(audio_url)
        if audio_response.status_code == 200:
            return audio_response.content
        else:
            print("Failed to fetch audio:", audio_response.status_code)
            return None

    except Exception as e:
        print("TTS generation exception:", e)
        return None
