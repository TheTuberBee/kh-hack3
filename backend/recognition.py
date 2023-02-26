from google.cloud import vision
import io
client = vision.ImageAnnotatorClient()
import dotenv

import openai

# get api key from .env
openai.api_key = dotenv.get_key(".env", "OPENAI_API_KEY")

engine = "text-davinci-003"
prompt = 'you get some texts, 2 of them are soccer team names (eg. Real Madrid). you can combine multiple words if needed. you also need to find the scores. the original text looks like this: "{TEAM1} {SCORE1} - {SCORE2} {TEAM2}".  return only this structure: {"team1": team1, "team2": team2, "score1", "score2"}'
temperature = 0.7
max_tokens = 256
n = 1
stop = None

def read_stats(filename):
    with io.open(f"uploads/{filename}", 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    score = ""
    print('Texts:')
    all_text = ""
    for text in texts:
        all_text += text.description
        all_text += "\n"

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))
    


    gpt_response = openai.Completion.create(
        engine=engine,
        prompt=prompt + "\nTexts:\n" + all_text,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=n,
        stop=stop
    )

    print(gpt_response)

    response_text = gpt_response.choices[0].text

    response_text = response_text.replace("\n", "")
    
    return response_text

