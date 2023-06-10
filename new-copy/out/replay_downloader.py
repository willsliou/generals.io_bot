import requests

# The URL of the replay you want to download
url = "https://bot.generals.io/replays/rgTZd--w2"

# Make a GET request to the URL
response = requests.get(url)

# The response content is the data of the replay
replay_data = response.content

# Write the data to a file
with open('replay.json', 'wb') as f:
    f.write(replay_data)