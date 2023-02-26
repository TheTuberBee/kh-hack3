from google.cloud import vision
import io
client = vision.ImageAnnotatorClient()
import os

import openai

# get api key from environment variable
openai.api_key = os.environ["OPENAI_API_KEY"]

engine = "text-davinci-003"
prompt = 'you get some texts, 2 of them are real soccer team names (eg. Real Madrid). you can combine multiple words if needed, but only using words from the given texts. we need only the main name of the team, Football Club is unneccessary. Tilbor and RCB are not teams! you also need to find the scores. the original text looks like this, no other text is needed: "{TEAM1} {SCORE1} - {SCORE2} {TEAM2}". give the answer in this json format: {"team1": team1, "team2": team2, "score1", "score2"}'
temperature = 0.7
max_tokens = 256
n = 1
stop = None

def read_stats(content):
    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    score = ""
    print('Texts:')
    all_text = ""
    for text in texts:
        print(text.description)
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
    response_text = response_text.replace("END", "")
    
    return response_text

