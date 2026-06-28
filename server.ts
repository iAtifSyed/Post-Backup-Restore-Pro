import express from "express";
import path from "path";
import fs from "fs";
// @ts-ignore
import archiver from "archiver";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/**
 * 1. API: Get WordPress Plugin File List & Code
 */
app.get("/api/get-plugin-files", (req, res) => {
  const pluginDir = path.join(process.cwd(), "plugin", "post-backup-restore-pro");
  
  if (!fs.existsSync(pluginDir)) {
    return res.status(404).json({ error: "Plugin files not found." });
  }

  const getFilesRecursively = (dir: string, baseDir: string): any[] => {
    let results: any[] = [];
    const list = fs.readdirSync(dir);
    
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const relativePath = path.relative(baseDir, filePath);
      
      if (stat && stat.isDirectory()) {
        results.push({
          name: file,
          path: relativePath,
          type: "directory",
          children: getFilesRecursively(filePath, baseDir),
        });
      } else {
        const content = fs.readFileSync(filePath, "utf-8");
        results.push({
          name: file,
          path: relativePath,
          type: "file",
          content: content,
        });
      }
    });
    
    // Sort directories first, then files
    return results.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "directory" ? -1 : 1;
    });
  };

  try {
    const fileTree = getFilesRecursively(pluginDir, pluginDir);
    res.json({ success: true, files: fileTree });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 2. API: Download Complete WordPress Plugin ZIP
 */
app.get("/api/download-plugin-zip", (req, res) => {
  const pluginDir = path.join(process.cwd(), "plugin", "post-backup-restore-pro");

  if (!fs.existsSync(pluginDir)) {
    return res.status(404).send("Plugin directory not found.");
  }

  res.setHeader("Content-Disposition", "attachment; filename=post-backup-restore-pro.zip");
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);
  
  // Append all files in the plugin directory under a root folder 'post-backup-restore-pro/' inside the ZIP
  archive.directory(pluginDir, "post-backup-restore-pro");
  archive.finalize();
});

/**
 * 3. API: Generate Mock WordPress Posts using Gemini
 */
app.post("/api/generate-mock-posts", async (req, res) => {
  const { topic = "Organic Coffee & Travel Blog", count = 3 } = req.body;
  
  const defaultFallbackPosts = [
    {
      ID: 101,
      Title: "The Ultimate Guide to Brewing Perfect Espresso",
      Slug: "guide-brewing-perfect-espresso",
      URL: "http://example-blog.com/guide-brewing-perfect-espresso",
      "Published Date": "2026-05-12 10:30:00",
      "Modified Date": "2026-06-25 14:20:00",
      Author: "Atif Syed",
      Categories: ["Coffee Guides", "Espresso"],
      Tags: ["Espresso", "Brewing", "Barista"],
      "SEO Title": "Master Espresso Brewing - Step-by-Step Guide",
      "Meta Description": "Learn how to dial-in, tamp, and pull the perfect espresso shot with pro barista techniques from Atif Syed.",
      "Focus Keyword": "brew espresso",
      "Featured Image": "https://images.unsplash.com/photo-1510972527409-cac5c441506a?auto=format&fit=crop&w=800&q=80",
      "Gallery Images": [
        { filename: "espresso_portafilter.jpg", original_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80" }
      ],
      Content: "Brewing espresso is both an art and a science. This post breaks down how water pressure, grind size, coffee weight, and tamping pressure affect your espresso shot extraction. Aim for a 1:2 brew ratio (e.g. 18g ground coffee in, 36g espresso out) in about 25 to 30 seconds for the ultimate velvety crema.",
      Excerpt: "Discover the professional science behind dialing-in espresso, matching grind size, and pulling a perfect sweet shot.",
      "Word Count": 78,
      "Reading Time": "1 min",
      "Custom Fields": { "coffee_origin": "Ethiopia", "roast_level": "Medium-Light" },
      Status: "publish"
    },
    {
      ID: 102,
      Title: "Top 5 Sustainable Coffee Farms in Colombia",
      Slug: "sustainable-coffee-farms-colombia",
      URL: "http://example-blog.com/sustainable-coffee-farms-colombia",
      "Published Date": "2026-06-18 09:15:00",
      "Modified Date": "2026-06-20 11:45:00",
      Author: "Atif Syed",
      Categories: ["Coffee Culture", "Travel"],
      Tags: ["Colombia", "Sustainability", "Fair Trade"],
      "SEO Title": "Eco-Friendly Colombian Coffee Farms You Must Visit",
      "Meta Description": "A curated travel log highlighting five of the most stunning organic and fair-trade coffee farms in the Colombian Andes.",
      "Focus Keyword": "Colombian coffee farms",
      "Featured Image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      "Gallery Images": [],
      Content: "Colombia remains one of the premier specialty coffee growing regions on Earth. In this travel log, we explore five coffee fincas in the Quindío region that prioritize organic farming, clean water recycling, and fair wages for local pickers. Visitors can participate in cherry picking, washing, and traditional cupping sessions.",
      Excerpt: "Explore five eco-conscious specialty coffee fincas in Colombia's legendary Coffee Triangle that focus on organic cultivation.",
      "Word Count": 64,
      "Reading Time": "1 min",
      "Custom Fields": { "altitude_meters": "1800", "variety_types": "Castillo, Caturra" },
      Status: "publish"
    }
  ];

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return high quality fallback
    return res.json({ success: true, posts: defaultFallbackPosts, note: "Fallback content served. To enable real AI content generation, add a GEMINI_API_KEY." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Generate exactly ${count} realistic, high-quality WordPress blog posts on the topic of "${topic}".
    Return the response ONLY as a valid JSON array matching this exact typescript interface structure, with absolutely no surrounding markdown, no backticks, and no conversation:
    
    interface WPBackupPost {
      ID: number;
      Title: string;
      Slug: string;
      URL: string;
      "Published Date": string; // YYYY-MM-DD HH:MM:SS format
      "Modified Date": string; // YYYY-MM-DD HH:MM:SS format
      Author: string;
      Categories: string[];
      Tags: string[];
      "SEO Title": string;
      "Meta Description": string;
      "Focus Keyword": string;
      "Featured Image": string; // Realistic Unsplash image URL e.g. https://images.unsplash.com/photo-...
      "Gallery Images": { filename: string; original_url: string }[]; // Provide 1 or 2 realistic inline image URLs
      Content: string; // Detailed HTML content of the blog post including <h3>, <p>, and <img> elements containing the gallery image original_urls.
      Excerpt: string;
      "Word Count": number;
      "Reading Time": string; // e.g. "3 min"
      "Custom Fields": Record<string, string>; // 2-3 custom field key-values relevant to the topic
      Status: "publish" | "draft";
    }
    
    Make the HTML content rich, informative, and structurally sound. Include standard inline image HTML referencing the original_urls from the Gallery Images array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text ? response.text.trim() : "";
    
    // Attempt parsing
    try {
      const parsedPosts = JSON.parse(text);
      if (Array.isArray(parsedPosts)) {
        return res.json({ success: true, posts: parsedPosts });
      }
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", text, parseErr);
    }

    res.json({ success: true, posts: defaultFallbackPosts, note: "Parsed error - fell back to defaults." });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.json({ success: true, posts: defaultFallbackPosts, note: `API Error: ${err.message}. Fell back to defaults.` });
  }
});

/**
 * 4. API: Download Simulated Backup ZIP
 * Compiles a real .zip file from the client's current simulated posts table!
 */
app.post("/api/download-backup-zip", async (req, res) => {
  const { posts = [] } = req.body;

  if (!Array.isArray(posts) || posts.length === 0) {
    return res.status(400).send("No posts provided for ZIP backup.");
  }

  res.setHeader("Content-Disposition", "attachment; filename=my-blog-backup.zip");
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err: any) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // 1. Add /readme.txt
  const readmeText = `==================================================
Post Backup & Restore Pro - Simulated Backup File
==================================================

This simulated backup ZIP file contains posts generated inside the AI Studio Post Backup & Restore Pro Workspace.

Backup Summary:
- Total Posts Packed: ${posts.length}
- Core Generator: Post Backup & Restore Pro v1.0.0
- Developer Website: http://iatifsyed.github.io/

Directories in this ZIP:
- /posts/      : HTML files for easy reading/manipulation
- /images/     : Content inline and featured images
- /metadata/   : CSV, JSON and XML schemas used for absolute WordPress sync
`;
  archive.append(readmeText, { name: "readme.txt" });

  // 2. Add /version.json
  const versionJson = JSON.stringify({
    plugin_version: "1.0.0",
    wp_version: "6.5",
    export_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    posts_count: posts.length,
    images_count: posts.reduce((acc, p) => acc + (p["Gallery Images"]?.length || 0) + (p["Featured Image"] ? 1 : 0), 0)
  }, null, 2);
  archive.append(versionJson, { name: "version.json" });

  // 3. Add individual post HTML files in /posts/
  posts.forEach((post) => {
    const postHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${post.Title}</title>
    <meta name="slug" content="${post.Slug}">
    <meta name="published_date" content="${post["Published Date"]}">
    <meta name="author" content="${post.Author}">
    <meta name="categories" content="${post.Categories?.join(", ")}">
    <meta name="tags" content="${post.Tags?.join(", ")}">
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
        h1 { color: #111; }
        .meta { font-size: 0.9rem; color: #666; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>${post.Title}</h1>
    <div class="meta">
        <strong>Published:</strong> ${post["Published Date"]} | 
        <strong>Author:</strong> ${post.Author} | 
        <strong>Categories:</strong> ${post.Categories?.join(", ")}
    </div>
    <div class="content">
        ${post.Content}
    </div>
</body>
</html>`;
    archive.append(postHtml, { name: `posts/post-${post.ID}.html` });
  });

  // 4. Add /metadata/posts.json
  archive.append(JSON.stringify(posts, null, 2), { name: "metadata/posts.json" });

  // 5. Add /metadata/posts.csv
  let csvContent = "Title,Slug,URL,Date,Category,Author,Featured Image URL\n";
  posts.forEach((p) => {
    const cleanTitle = p.Title.replace(/"/g, '""');
    const cleanCategories = (p.Categories?.join(", ") || "").replace(/"/g, '""');
    csvContent += `"${cleanTitle}","${p.Slug}","${p.URL}","${p["Published Date"]}","${cleanCategories}","${p.Author}","${p["Featured Image"] || ""}"\n`;
  });
  archive.append(csvContent, { name: "metadata/posts.csv" });

  // 6. Add /metadata/wordpress-export.xml
  let xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
    <title>Simulated WP Blog</title>
    <wp:wxr_version>1.2</wp:wxr_version>\n`;
  posts.forEach((p) => {
    xmlContent += `    <item>
        <title>${p.Title}</title>
        <link>${p.URL}</link>
        <pubDate>${p["Published Date"]}</pubDate>
        <content:encoded><![CDATA[${p.Content}]]></content:encoded>
        <wp:post_name>${p.Slug}</wp:post_name>
        <wp:status>${p.Status}</wp:status>
        <wp:post_type>post</wp:post_type>
    </item>\n`;
  });
  xmlContent += `</channel>\n</rss>`;
  archive.append(xmlContent, { name: "metadata/wordpress-export.xml" });

  // Fetch actual inline and featured images from URLs to bundle inside ZIP
  const downloadTasks: Promise<void>[] = [];

  const fetchWithTimeout = async (url: string, timeoutMs = 6000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  posts.forEach((post) => {
    // 7. Download Featured Image
    if (post["Featured Image"] && typeof post["Featured Image"] === "string" && post["Featured Image"].startsWith("http")) {
      const url = post["Featured Image"];
      const task = (async () => {
        try {
          const response = await fetchWithTimeout(url);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            archive.append(buffer, { name: `images/featured-${post.ID}.jpg` });
          }
        } catch (err: any) {
          console.error(`Error downloading featured image for post ${post.ID} from ${url}:`, err.message);
        }
      })();
      downloadTasks.push(task);
    }

    // 8. Download Gallery/Inline Images
    if (Array.isArray(post["Gallery Images"])) {
      post["Gallery Images"].forEach((img: any, idx: number) => {
        if (img && img.original_url && typeof img.original_url === "string" && img.original_url.startsWith("http")) {
          const url = img.original_url;
          const filename = img.filename || `gallery-${post.ID}-${idx}.jpg`;
          const task = (async () => {
            try {
              const response = await fetchWithTimeout(url);
              if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                archive.append(buffer, { name: `images/${filename}` });
              }
            } catch (err: any) {
              console.error(`Error downloading gallery image ${filename} for post ${post.ID} from ${url}:`, err.message);
            }
          })();
          downloadTasks.push(task);
        }
      });
    }
  });

  // Wait for all image download promises to settle before final completion
  await Promise.allSettled(downloadTasks);

  archive.finalize();
});

/**
 * 5. Handle Vite / Static File Serving Orchestration
 */
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
