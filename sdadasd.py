import base64
import json
import requests

REPO_URL = "https://api.github.com/repos/r3conx/Tester-Zale-no-ci/contents/script.js?ref=main"
TOKEN = "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"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v4+raw"
}

response = requests.get(REPO_URL, headers=headers)

if response and response.status_code == 200:
    print(response)
else:
    print(response)