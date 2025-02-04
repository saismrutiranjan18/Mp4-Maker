const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/get_formats", (req, res) => {
    const url = req.body.url;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    exec(`yt-dlp -F "${url}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (stderr && !stdout) {
            return res.status(500).json({ error: stderr });
        }

        const lines = stdout.split("\n").slice(3); // Adjusted slicing
        const formats = lines
            .map((line) => line.trim().split(/\s+/))
            .filter((parts) => parts.length > 2)
            .map((parts) => ({
                format_id: parts[0],
                ext: parts[1],
                resolution: parts.slice(2).join(" "),
            }));

        res.json({ formats });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
