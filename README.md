# Zarkhera AI — real image-analysis prototype

## What this does
Uploads a crop photo to a secure Node.js backend, sends the image to a vision-capable OpenAI model, and returns structured diagnosis/management in English, Urdu, or Sindhi.

## Run
1. Install Node.js 20+.
2. Open this folder in a terminal.
3. Run: npm install
4. Set your API key as an environment variable (never put it in index.html):
   - Windows PowerShell: $env:OPENAI_API_KEY="YOUR_KEY"
   - macOS/Linux: export OPENAI_API_KEY="YOUR_KEY"
5. Run: npm start
6. Open: http://localhost:3000

## Important
This is an AI-assisted screening tool, not a laboratory diagnosis. A single photo can be ambiguous. For pesticide use, follow locally registered product labels and local agricultural extension advice.

## Next production steps
- Deploy backend on a secure server.
- Add user accounts/rate limits.
- Store anonymized results only if needed.
- Add more Pakistan-specific crops and verified extension references.
- Test accuracy on real Pakistani field photos before commercial launch.
