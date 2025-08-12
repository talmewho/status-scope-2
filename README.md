# Status-Scope

To run it locally against a real API (change the URL here) -

`STATUS_URL_TEMPLATE=(API-URL-here-with-a-{region}-for-the-region-parameter) npm run dev`

To run it locally against a mock endpoint and quick refreshing -

`MINIMAL_FETCH_INTERVAL=15000 SERVE_MOCK_STATUS=true FETCH_INTERVAL=10000 STATUS_URL_TEMPLATE=http://localhost:3000/api/mock-status?region={region} npm run dev`


To see it in action -

https://yodelling-karissa-talmewho-673087a7.koyeb.app/

<img width="1490" height="1007" alt="image" src="https://github.com/user-attachments/assets/40910f4c-e868-4b0b-860a-2291c0efa706" />
