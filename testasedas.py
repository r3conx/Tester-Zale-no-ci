import requests

# Dane do autoryzacji i konfiguracji
token = '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'
repo = 'r3conx/Tester-Zale-no-ci'
file_path = 'Tester-Zale-no-ci/script.js'

# URL do API GitHub
url = f'https://api.github.com/repos/{repo}/contents/{file_path}'

# Nagłówki z tokenem autoryzacyjnym
headers = {
    'Authorization': f'token {token}',
    'Accept': 'application/vnd.github.v3.raw'
}

# Wykonanie żądania
response = requests.get(url, headers=headers)

# Sprawdzenie odpowiedzi i wypisanie zawartości
if response.status_code == 200:
    content = response.text
    print(content)
else:
    print(f'Błąd: {response.status_code}')
