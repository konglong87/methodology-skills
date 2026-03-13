import { Arg, Skill } from "@anthropic-aliases";

/**
 * WeChat Article Writer Skill
 *
 * A skill for creating WeChat-style articles with optimized readability, format, and structure.
 *
 * Usage:
 *   /wechat-article-writer "Your Topic Here"
 *   /wechat-article-writer --article ./outline.md
 *   /wechat-article-writer "Your Topic" --style warm
 *
 *   --article <topic> - The topic to write about.**
 *   --style <style> - Visual style: notion (default), warm, minimal, bold, chalkboard
 *   --output <path> - Output path (default: ./article.md)
 */
export const wechatArticleWriter: Skill = Skill.create({
  name: "wechat-article-writer",
  description: "Generate a WeChat article (title, content, summary). Input: topic string",
});

// Main argument: the topic (string)
const topicArg: Arg = {
  prompt: {
    type: "argument",
    name: "article",
    description: "The topic to write about",
  },
 //   name: 'article',
};

export default wechatArticleWriter;