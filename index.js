const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require("body-parser");
const configuration = new Configuration({
    organization: "org-ebI756mnzxAV4diljsK78oDQ",
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors())
const port = 3080

app.post('/', async (req, res) => {
    const {message, currentModel} = req.body;
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: `${currentModel}`,//"text-davinci-003",
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.5,
    });
    res.json({
        message: response.data.choices[0].text,
    })
});
app.get("/models", async (req, res) => {
    const response = await openai.listModels();
    console.log(response.data.data);
    res.json({
        models: response.data.data
    })
});

 app.listen(port, () => {
  console.log('Server started on port 3080');
});
