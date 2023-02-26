import os
import openai as ai
import time
try:
    ai.api_key = os.environ["OPENAI_API_KEY"]
except:
    ai.api_key = input("OpenAI API Key: ")

def generate_gpt3_response(user_text, print_output=False):
    """
    Query OpenAI GPT-3 for the specific key and get back a response
    :type user_text: str the user's text to query for
    :type print_output: boolean whether or not to print the raw output JSON
    """
    start_time = time.time()

    completions = ai.Completion.create(
        engine='text-davinci-003',  # Determines the quality, speed, and cost.
        temperature=0.4,            # Level of creativity in the response
        prompt=user_text,           # What the user typed in
        max_tokens=600,             # Maximum tokens in the prompt AND response
        n=1,                        # The number of completions to generate
        stop="***END***",           # An optional setting to control response generation
    )

    end_time = time.time()
    print("GPT-3 INFO: Completion time taken: " + str(end_time - start_time) + " seconds")

    # Debug output
    if print_output:
        print(completions)

    # Return the first choice
    return completions.choices[0].text

def get_opinion(participant):
    stats = str(participant)
    prompt = "Given the stats of a League of Legends player who participated in a match, provide a detailed analysis of their playstyle. Describe how the player typically approaches the game, including their strengths and weaknesses, preferred strategies, and any notable habits or tendencies. Use the provided stats as evidence to support your analysis. Additionally, provide several relevant tags that capture the essence of the player's style, starting with \"***TAGS***\", separated by commas, and ending with \"***END***\".\n\n" + stats + "\n"
    response = generate_gpt3_response(prompt)
    pieces = [piece.strip() for piece in response.split("***TAGS***")]
    tags = [tag.strip().lower().capitalize() for tag in pieces[1].split(",") if tag.strip() != ""]
    return pieces[0], tags

def combine_tags(tags1: list, tags2: list):
    tags1 = ", ".join(tags1)
    tags2 = ", ".join(tags2)
    prompt = "Here are two sets of tags given to a League of Legend player's playstyle. Combine the two sets and reduce the number of them, provide reasoning. List the final tags starting with \"***TAGS***\", separated by commas and ending with \"***END***\".\n" + tags1 + "\n" + tags2 + "\n"
    response = generate_gpt3_response(prompt)
    pieces = [piece.strip() for piece in response.split("***TAGS***")]
    tags = [tag.strip().lower().capitalize() for tag in pieces[1].split(",") if tag.strip() != ""]
    return tags

# prompt = "Here are the stats of a player who has participated in a League of Legends match. Explain the player's playstyle based on them, and give the player a few matching tags starting with \"***TAGS***\", separated by commas and ending with \"***END***\".\n\n" + stats + "\n"
