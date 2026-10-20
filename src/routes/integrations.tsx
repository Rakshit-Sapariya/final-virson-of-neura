import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Zap,
  Terminal,
  Code2,
  Database,
  Cloud,
  Layers,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Bot,
  ShieldCheck,
  Workflow,
  X,
  Cpu,
  Plus,
  Globe,
  Settings,
  Trash2,
  Radio,
  FileText,
  Calendar,
  Mail,
  Share2,
  Phone,
  Flame,
  Compass,
  TrendingUp,
  Palette,
} from "lucide-react";
import {
  SiGithub,
  SiDiscord,
  SiNotion,
  SiSupabase,
  SiDocker,
  SiFigma,
  SiLinear,
  SiPostgresql,
  SiRedis,
  SiGooglecloud,
  SiGoogledrive,
  SiGmail,
  SiGooglecalendar,
  SiZapier,
  SiHubspot,
  SiJira,
  SiConfluence,
  SiStripe,
  SiSpotify,
  SiGitlab,
  SiSentry,
  SiPostman,
  SiWolfram,
  SiPerplexity,
  SiVercel,
  SiNetlify,
  SiCloudflare,
  SiDatadog,
  SiGrafana,
  SiKubernetes,
  SiTerraform,
  SiMongodb,
  SiSnowflake,
  SiElastic,
  SiBitbucket,
  SiAirtable,
  SiTrello,
  SiAsana,
  SiClickup,
  SiObsidian,
  SiMiro,
  SiLoom,
  SiZoom,
  SiDropbox,
  SiBox,
  SiCoda,
  SiMake,
  SiN8N,
  SiZendesk,
  SiIntercom,
  SiMailchimp,
  SiShopify,
  SiQuickbooks,
  SiDribbble,
  SiUnsplash,
  SiX,
  SiReddit,
  SiYoutube,
  SiMedium,
  SiWordpress,
  SiGhost,
  SiHuggingface,
  SiReplicate,
  SiQdrant,
  SiGithubactions,
  SiCircleci,
  SiPrisma,
  SiGraphql,
  SiSwagger,
  SiApachekafka,
  SiRabbitmq,
  SiClickhouse,
  SiCockroachlabs,
  SiDuckdb,
  SiNeo4J,
  SiFirebase,
  SiAppwrite,
  SiGoogledocs,
  SiGooglesheets,
  SiGoogleslides,
  SiGooglemeet,
  SiGoogleforms,
  SiGooglekeep,
  SiGooglecolab,
  SiGooglebigquery,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiDuckduckgo,
  SiBrave,
  SiDigitalocean,
  SiRender,
  SiRailway,
  SiFlydotio,
  SiAnsible,
  SiHelm,
  SiArgo,
  SiPrometheus,
  SiNginx,
  SiApache,
  SiCaddy,
  SiTraefikproxy,
  SiAuth0,
  SiClerk,
  SiOkta,
  Si1Password,
  SiBitwarden,
  SiCypress,
  SiJest,
  SiVitest,
  SiSonar,
  SiCodecov,
  SiMysql,
  SiMariadb,
  SiSqlite,
  SiMinio,
  SiApachecassandra,
  SiFauna,
  SiInfluxdb,
  SiTimescale,
  SiPlanetscale,
  SiUpstash,
  SiSurrealdb,
  SiBun,
  SiDeno,
  SiPnpm,
  SiYarn,
  SiNpm,
  SiVite,
  SiTurborepo,
  SiNextdotjs,
  SiNuxt,
  SiSvelte,
  SiAstro,
  SiTailwindcss,
  SiPytorch,
  SiTensorflow,
  SiKeras,
  SiOpencv,
  SiJupyter,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiWeightsandbiases,
  SiMlflow,
  SiApachespark,
  SiApacheairflow,
  SiRay,
  SiTelegram,
  SiWhatsapp,
  SiSignal,
  SiMatrix,
  SiDiscourse,
  SiBasecamp,
  SiPodman,
  SiGooglechrome,
  SiFirefoxbrowser,
  SiSafari,
  SiTorbrowser,
  SiArc,
  SiPaypal,
  SiSquare,
  SiWise,
  SiCoinbase,
  SiFramer,
  SiBlender,
  SiSketch,
  SiNewrelic,
  SiRaycast,
  SiPuppeteer,
} from "react-icons/si";
import { FaSlack, FaAws, FaSalesforce, FaMicrosoft, FaLinkedin } from "react-icons/fa6";
import { VscVscode, VscAzure, VscAzureDevops } from "react-icons/vsc";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations & Ecosystem — NEURA - TECH" },
      {
        name: "description",
        content:
          "Connect Neura with your developer tools, cloud infrastructure, databases, and communication channels.",
      },
    ],
  }),
  component: IntegrationsPage,
});

type Category = "all" | "productivity" | "developer" | "cloud" | "ai" | "custom";

type Integration = {
  id: string;
  name: string;
  category: "developer" | "cloud" | "productivity" | "ai" | "custom";
  description: string;
  icon: any;
  accent: string;
  badge?: string;
  tags: string[];
  popular?: boolean;
  connected?: boolean;
  docsUrl: string;
  connectUrl: string;
  isCustom?: boolean;
  authType?: string;
};

const INTEGRATIONS: Integration[] = [
{
    id: "github",
    name: "GitHub",
    category: "developer",
    description:
      "Automated code review, semantic repository indexing, pull request synthesis, and branch intelligence.",
    icon: SiGithub,
    accent: "#6ee7ff",
    badge: "Official",
    tags: ["Code Review", "PR Synthesis", "Webhooks"],
    popular: true,
    docsUrl: "https://docs.github.com",
    connectUrl: "https://github.com/settings/connections/applications",
  },
{
    id: "vscode",
    name: "VS Code & Cursor",
    category: "developer",
    description:
      "Context-aware code completion, instant terminal debugging, and multi-file architectural refactoring inside your editor.",
    icon: VscVscode,
    accent: "#007acc",
    badge: "Extension",
    tags: ["Autocomplete", "Diagnostics", "Zero-Latency"],
    popular: true,
    docsUrl: "https://code.visualstudio.com",
    connectUrl: "https://marketplace.visualstudio.com",
  },
{
    id: "supabase",
    name: "Supabase",
    category: "cloud",
    description:
      "Native pgvector semantic search, edge function triggers, real-time database synchronization, and row-level security.",
    icon: SiSupabase,
    accent: "#3ecf8e",
    badge: "Native",
    tags: ["pgvector", "Realtime Sync", "Edge Auth"],
    popular: true,
    docsUrl: "https://supabase.com",
    connectUrl: "https://supabase.com/dashboard/project/_/settings/api",
  },
{
    id: "docker",
    name: "Docker",
    category: "developer",
    description:
      "Container health analysis, multi-stage Dockerfile optimization, and automated environment deployment checks.",
    icon: SiDocker,
    accent: "#2496ed",
    tags: ["Containers", "Telemetry", "CI/CD"],
    docsUrl: "https://docker.com",
    connectUrl: "https://hub.docker.com/settings/security",
  },
{
    id: "terminal",
    name: "Neura CLI & Terminal",
    category: "developer",
    description:
      "Powerful command-line agent for macOS, Linux, and Windows. Run scripts, inspect local codebases, and stream logs.",
    icon: Terminal,
    accent: "#a78bfa",
    badge: "CLI v2.4",
    tags: ["Shell Integration", "Local Files", "POSIX/Win"],
    popular: true,
    docsUrl: "https://github.com/Rakshit-Sapariya/final-virson-of-neura",
    connectUrl: "https://github.com/Rakshit-Sapariya/final-virson-of-neura#getting-started",
  },
{
    id: "slack",
    name: "Slack",
    category: "productivity",
    description:
      "Summon Neura into channels and threads for real-time team answers, incident escalation, and automated daily standup summaries.",
    icon: FaSlack,
    accent: "#e01e5a",
    tags: ["Bot Assistant", "Thread Summaries", "Enterprise"],
    docsUrl: "https://slack.com",
    connectUrl: "https://api.slack.com/apps",
  },
{
    id: "discord",
    name: "Discord",
    category: "productivity",
    description:
      "Community developer bot with voice-channel interactions, automated support ticketing, and code snippet explanations.",
    icon: SiDiscord,
    accent: "#5865f2",
    tags: ["Voice AI", "Community", "Slash Commands"],
    docsUrl: "https://discord.com/developers/docs",
    connectUrl: "https://discord.com/developers/applications",
  },
{
    id: "notion",
    name: "Notion",
    category: "productivity",
    description:
      "Bi-directional sync with your Notion workspace. Auto-generate research pages, technical specs, and team wikis.",
    icon: SiNotion,
    accent: "#ffffff",
    badge: "Two-Way",
    tags: ["Knowledge Base", "Documentation", "Wikis"],
    popular: true,
    docsUrl: "https://notion.so",
    connectUrl: "https://www.notion.so/profile/integrations",
  },
{
    id: "linear",
    name: "Linear",
    category: "productivity",
    description:
      "Auto-link commits to issues, triage incoming bug reports, and generate engineering sprint updates with predictive velocity.",
    icon: SiLinear,
    accent: "#5e6ad2",
    tags: ["Issue Tracking", "Sprint Velocity", "Auto-Triage"],
    docsUrl: "https://linear.app",
    connectUrl: "https://linear.app/settings/api",
  },
{
    id: "figma",
    name: "Figma",
    category: "productivity",
    description:
      "Transform canvas frames into production React/Tailwind components and validate accessibility contrast ratios.",
    icon: SiFigma,
    accent: "#f24e1e",
    tags: ["Design-to-Code", "Tokens", "Canvas Sync"],
    docsUrl: "https://figma.com",
    connectUrl: "https://www.figma.com/settings",
  },
{
    id: "postgresql",
    name: "PostgreSQL",
    category: "cloud",
    description:
      "Direct database connection for schema reasoning, natural language query generation, and execution plan optimization.",
    icon: SiPostgresql,
    accent: "#336791",
    tags: ["SQL Generation", "EXPLAIN Analysis", "Connection Pool"],
    docsUrl: "https://postgresql.org",
    connectUrl: "https://www.postgresql.org/docs/current/auth-pg-hba-conf.html",
  },
{
    id: "redis",
    name: "Redis",
    category: "cloud",
    description:
      "Sub-millisecond semantic response cache, distributed rate limiting, and session state persistence for high-throughput apps.",
    icon: SiRedis,
    accent: "#dc382d",
    tags: ["Semantic Cache", "Rate Limiting", "KV Store"],
    docsUrl: "https://redis.io",
    connectUrl: "https://redis.io/docs/latest/operate/oss_and_stack/management/security/",
  },
{
    id: "googlecloud",
    name: "Google Cloud",
    category: "cloud",
    description:
      "Cloud Run deployments, Cloud Storage dataset ingestion, and enterprise single sign-on with Google Identity.",
    icon: SiGooglecloud,
    accent: "#4285f4",
    tags: ["Cloud Run", "GCS Buckets", "OAuth 2.0"],
    docsUrl: "https://cloud.google.com",
    connectUrl: "https://console.cloud.google.com/apis/credentials",
  },
{
    id: "aws",
    name: "Amazon Web Services",
    category: "cloud",
    description:
      "Serverless Lambda execution, S3 bucket semantic indexing, and IAM credential management with least-privilege scoping.",
    icon: FaAws,
    accent: "#ff9900",
    tags: ["AWS Lambda", "S3 Storage", "IAM Scoped"],
    docsUrl: "https://aws.amazon.com",
    connectUrl: "https://console.aws.amazon.com/iam/home#/security_credentials",
  },
{
    id: "webgpu",
    name: "WebGPU Local Inference",
    category: "ai",
    description:
      "100% offline, zero-network private inference powered by on-device GPU acceleration using quantized Neura Edge weights.",
    icon: Cpu,
    accent: "#6ee7ff",
    badge: "Zero-Latency",
    tags: ["Offline", "Privacy First", "VRAM Optimized"],
    popular: true,
    docsUrl: "#webgpu",
    connectUrl: "https://webgpureport.org",
  },
{
    id: "webhooks",
    name: "REST API & Webhooks",
    category: "ai",
    description:
      "Programmatic streaming completions, event-driven webhooks, and custom tool definitions compatible with standard OpenAPI specs.",
    icon: Workflow,
    accent: "#c084fc",
    badge: "OpenAPI",
    tags: ["SSE Streaming", "JSON Schema", "HMAC Signatures"],
    docsUrl: "#api",
    connectUrl: "/app",
  },
{
    id: "googledrive",
    name: "Google Drive & Docs",
    category: "productivity",
    description:
      "Real-time semantic document search, PDF indexing, spreadsheet analysis, and instant collaborative drafting.",
    icon: SiGoogledrive,
    accent: "#4285f4",
    badge: "Workspace",
    tags: ["Document Index", "Spreadsheets", "PDF Analysis"],
    popular: true,
    docsUrl: "https://support.google.com/drive",
    connectUrl: "https://drive.google.com",
  },
{
    id: "gmail",
    name: "Gmail & Smart Mail",
    category: "productivity",
    description:
      "Context-aware email triage, high-priority thread drafting, meeting extraction, and intelligent unsubscribe.",
    icon: SiGmail,
    accent: "#ea4335",
    badge: "Official",
    tags: ["Inbox Triage", "Draft Replies", "Thread Summary"],
    popular: true,
    docsUrl: "https://support.google.com/mail",
    connectUrl: "https://mail.google.com",
  },
{
    id: "googlecalendar",
    name: "Google Calendar",
    category: "productivity",
    description:
      "Natural language schedule planning, cross-timezone meeting coordination, and automated agenda briefing.",
    icon: SiGooglecalendar,
    accent: "#34a853",
    badge: "Schedule",
    tags: ["Calendar Sync", "Agenda Briefs", "Time Blocking"],
    popular: true,
    docsUrl: "https://support.google.com/calendar",
    connectUrl: "https://calendar.google.com",
  },
{
    id: "websearch",
    name: "Live Web Search & Browsing",
    category: "ai",
    description:
      "Real-time internet crawling, live news scraping, citation extraction, and autonomous web agent navigation.",
    icon: Globe,
    accent: "#38bdf8",
    badge: "Live Index",
    tags: ["Web Crawler", "Citations", "Real-Time Fact Check"],
    popular: true,
    docsUrl: "https://www.google.com",
    connectUrl: "https://www.google.com",
  },
{
    id: "perplexity",
    name: "Perplexity Deep Search",
    category: "ai",
    description:
      "Deep multi-source research synthesis, academic paper indexing, and grounded citation verification.",
    icon: SiPerplexity,
    accent: "#22b8cf",
    badge: "Citations",
    tags: ["Deep Research", "Academic Sources", "Web Fact-Checking"],
    popular: true,
    docsUrl: "https://www.perplexity.ai",
    connectUrl: "https://www.perplexity.ai",
  },
{
    id: "wolfram",
    name: "Wolfram Computational Core",
    category: "ai",
    description:
      "Symbolic mathematics, step-by-step calculus, differential equations, physics simulations, and scientific plotting.",
    icon: SiWolfram,
    accent: "#dd1100",
    badge: "Math & Physics",
    tags: ["Calculus", "Linear Algebra", "Scientific Computing"],
    popular: true,
    docsUrl: "https://www.wolframalpha.com",
    connectUrl: "https://www.wolframalpha.com",
  },
{
    id: "zapier",
    name: "Zapier Automation",
    category: "ai",
    description:
      "Trigger over 6,000+ business applications, automated CRM actions, and multi-step webhook pipelines.",
    icon: SiZapier,
    accent: "#ff4a00",
    badge: "6,000+ Apps",
    tags: ["Multi-Step Zaps", "No-Code", "Webhooks"],
    popular: true,
    docsUrl: "https://zapier.com",
    connectUrl: "https://zapier.com/app/connections",
  },
{
    id: "stripe",
    name: "Stripe Billing & Payments",
    category: "cloud",
    description:
      "Customer subscription telemetry, MRR metric synthesis, payment link creation, and automated invoice triage.",
    icon: SiStripe,
    accent: "#635bff",
    badge: "FinTech",
    tags: ["Subscriptions", "Invoice Gen", "Revenue Analytics"],
    popular: true,
    docsUrl: "https://stripe.com/docs",
    connectUrl: "https://dashboard.stripe.com/apikeys",
  },
{
    id: "jira",
    name: "Jira Software",
    category: "productivity",
    description:
      "Automated ticket triage, agile backlog refinement, predictive burndown analysis, and issue filing from conversations.",
    icon: SiJira,
    accent: "#0052cc",
    tags: ["Sprint Planning", "Bug Triage", "Kanban Sync"],
    docsUrl: "https://www.atlassian.com/software/jira",
    connectUrl: "https://id.atlassian.com",
  },
{
    id: "confluence",
    name: "Confluence Docs",
    category: "productivity",
    description:
      "Bi-directional enterprise knowledge base sync, PRD architecture generation, and engineering runbook publishing.",
    icon: SiConfluence,
    accent: "#172b4d",
    tags: ["Wiki Sync", "PRD Generation", "Runbooks"],
    docsUrl: "https://www.atlassian.com/software/confluence",
    connectUrl: "https://id.atlassian.com",
  },
{
    id: "hubspot",
    name: "HubSpot CRM",
    category: "productivity",
    description:
      "Inbound lead scoring, customer interaction logging, sales sequence drafts, and lifecycle stage tracking.",
    icon: SiHubspot,
    accent: "#ff7a59",
    tags: ["CRM Sync", "Lead Intelligence", "Deals"],
    docsUrl: "https://developers.hubspot.com",
    connectUrl: "https://app.hubspot.com",
  },
{
    id: "salesforce",
    name: "Salesforce Cloud",
    category: "cloud",
    description:
      "Natural language SOQL queries, enterprise opportunity updates, account contact intelligence, and workflow triggers.",
    icon: FaSalesforce,
    accent: "#00a1e0",
    badge: "Enterprise",
    tags: ["SOQL Queries", "Opportunity Sync", "Custom Objects"],
    docsUrl: "https://developer.salesforce.com",
    connectUrl: "https://login.salesforce.com",
  },
{
    id: "gitlab",
    name: "GitLab",
    category: "developer",
    description:
      "CI/CD YAML pipeline debugging, merge request code diff reviews, and container registry inspection.",
    icon: SiGitlab,
    accent: "#fc6d26",
    tags: ["GitLab CI", "Merge Requests", "DevOps"],
    docsUrl: "https://docs.gitlab.com",
    connectUrl: "https://gitlab.com",
  },
{
    id: "sentry",
    name: "Sentry Telemetry",
    category: "developer",
    description:
      "Production exception clustering, automated root-cause stack trace analysis, and suggested bug fixes.",
    icon: SiSentry,
    accent: "#fb4226",
    tags: ["Exception Triage", "Performance Tracing", "Crash Dumps"],
    docsUrl: "https://docs.sentry.io",
    connectUrl: "https://sentry.io",
  },
{
    id: "postman",
    name: "Postman Collections",
    category: "developer",
    description:
      "Direct collection import, mock server routing, automated contract testing, and schema validation.",
    icon: SiPostman,
    accent: "#ff6c37",
    tags: ["OpenAPI Import", "Mock API", "Contract Testing"],
    docsUrl: "https://learning.postman.com",
    connectUrl: "https://web.postman.co",
  },
{
    id: "spotify",
    name: "Spotify Focus Audio",
    category: "productivity",
    description:
      "Adaptive deep-work audio player, binaural beat generation, and distraction-free playback orchestration.",
    icon: SiSpotify,
    accent: "#1db954",
    tags: ["Deep Work", "Audio Control", "Soundscapes"],
    docsUrl: "https://developer.spotify.com",
    connectUrl: "https://developer.spotify.com/dashboard",
  },
{
    id: "vercel",
    name: "Vercel Edge Cloud",
    category: "developer",
    description:
      "Automated preview deployments, edge function diagnostics, build log analysis, and instant rollbacks.",
    icon: SiVercel,
    accent: "#ffffff",
    badge: "Fast Edge",
    tags: ["Edge Functions", "Next.js", "Serverless Deployment", "Preview URLs"],
    docsUrl: "https://vercel.com/docs",
    connectUrl: "https://vercel.com/dashboard",
  },
{
    id: "netlify",
    name: "Netlify",
    category: "developer",
    description:
      "Static site continuous deployment, edge functions routing, form submissions, and CDN cache invalidation.",
    icon: SiNetlify,
    accent: "#00c7b7",
    tags: ["Static Hosting", "Edge Handlers", "Instant Previews", "Continuous Build"],
    docsUrl: "https://docs.netlify.com",
    connectUrl: "https://app.netlify.com",
  },
{
    id: "cloudflare",
    name: "Cloudflare Workers & KV",
    category: "cloud",
    description:
      "Global distributed serverless workers, D1 SQL queries, R2 object store manipulation, and Zero Trust policies.",
    icon: SiCloudflare,
    accent: "#f38020",
    badge: "Global Edge",
    tags: ["Workers KV", "D1 SQL", "Zero Trust", "R2 Storage"],
    docsUrl: "https://developers.cloudflare.com",
    connectUrl: "https://dash.cloudflare.com",
  },
{
    id: "datadog",
    name: "Datadog APM & Logs",
    category: "developer",
    description:
      "End-to-end distributed tracing, production metric anomaly detection, live log ingestion, and incident alerts.",
    icon: SiDatadog,
    accent: "#632ca6",
    tags: ["APM Tracing", "Real-time Metrics", "Synthetic Logs", "Anomaly Alerts"],
    docsUrl: "https://docs.datadoghq.com",
    connectUrl: "https://app.datadoghq.com",
  },
{
    id: "grafana",
    name: "Grafana Observability",
    category: "developer",
    description:
      "Telemetry dashboard synthesis, Prometheus PromQL queries, Loki log streaming, and operational alerting.",
    icon: SiGrafana,
    accent: "#f46800",
    tags: ["Telemetry Dashboards", "Prometheus", "Loki Logs", "Alerting"],
    docsUrl: "https://grafana.com/docs",
    connectUrl: "https://grafana.com",
  },
{
    id: "kubernetes",
    name: "Kubernetes Cluster",
    category: "cloud",
    description:
      "Cluster state introspection, pod log diagnostics, YAML manifest generation, and horizontal pod autoscaling.",
    icon: SiKubernetes,
    accent: "#326ce5",
    tags: ["Cluster Orchestration", "Pod Autoscaling", "Ingress Controller", "K8s API"],
    docsUrl: "https://kubernetes.io/docs",
    connectUrl: "https://kubernetes.io",
  },
{
    id: "terraform",
    name: "HashiCorp Terraform",
    category: "developer",
    description:
      "Infrastructure as Code synthesis, state file inspection, HCL plan generation, and cloud drift detection.",
    icon: SiTerraform,
    accent: "#844fba",
    tags: ["Infrastructure as Code", "HCL State", "Cloud Provisioning", "Drift Detection"],
    docsUrl: "https://developer.hashicorp.com/terraform",
    connectUrl: "https://app.terraform.io",
  },
{
    id: "mongodb",
    name: "MongoDB Atlas",
    category: "cloud",
    description:
      "BSON document search, Atlas Vector Search pipelines, change stream webhooks, and aggregation pipelines.",
    icon: SiMongodb,
    accent: "#47a248",
    tags: ["NoSQL Document DB", "Atlas Vector Search", "Change Streams", "Aggregation"],
    docsUrl: "https://www.mongodb.com/docs",
    connectUrl: "https://cloud.mongodb.com",
  },
{
    id: "snowflake",
    name: "Snowflake Data Cloud",
    category: "cloud",
    description:
      "Cross-cloud warehouse querying, data mesh synchronization, zero-copy cloning, and analytical SQL generation.",
    icon: SiSnowflake,
    accent: "#29b5e8",
    badge: "Big Data",
    tags: ["Data Warehouse", "SQL Analytics", "Zero-Copy Clone", "Data Mesh"],
    docsUrl: "https://docs.snowflake.com",
    connectUrl: "https://app.snowflake.com",
  },
{
    id: "elastic",
    name: "Elasticsearch & Kibana",
    category: "cloud",
    description:
      "BM25 and dense vector hybrid search, inverted index inspection, Logstash event pipelines, and Kibana visualizations.",
    icon: SiElastic,
    accent: "#005571",
    tags: ["Hybrid Search", "Dense Vectors", "Kibana", "Logstash ETL"],
    docsUrl: "https://www.elastic.co/docs",
    connectUrl: "https://cloud.elastic.co",
  },
{
    id: "bitbucket",
    name: "Atlassian Bitbucket",
    category: "developer",
    description:
      "Enterprise Git repositories, Bitbucket Pipelines CI/CD integration, pull request code review, and Jira linking.",
    icon: SiBitbucket,
    accent: "#0052cc",
    tags: ["Git Repositories", "Pipelines CI", "Jira Integration", "Code Review"],
    docsUrl: "https://support.atlassian.com/bitbucket-cloud",
    connectUrl: "https://bitbucket.org",
  },
{
    id: "airtable",
    name: "Airtable Relational Base",
    category: "productivity",
    description:
      "Low-code relational database operations, automated record updates, formula execution, and form schema sync.",
    icon: SiAirtable,
    accent: "#18bfff",
    tags: ["Relational Base", "Automated Tables", "REST API", "Low-code Forms"],
    docsUrl: "https://airtable.com/developers/web/api/introduction",
    connectUrl: "https://airtable.com",
  },
{
    id: "trello",
    name: "Trello Kanban",
    category: "productivity",
    description:
      "Sprint board organization, card generation from code tasks, checklist tracking, and Power-Up automated actions.",
    icon: SiTrello,
    accent: "#0079bf",
    tags: ["Kanban Boards", "Sprint Cards", "Power-Ups", "Team Workflows"],
    docsUrl: "https://developer.atlassian.com/cloud/trello",
    connectUrl: "https://trello.com",
  },
{
    id: "asana",
    name: "Asana Project Suite",
    category: "productivity",
    description:
      "Milestone tracking, Gantt timeline generation, dependency mapping, and automated task assignments.",
    icon: SiAsana,
    accent: "#f06a6a",
    tags: ["Milestones", "Gantt Timeline", "Portfolio Status", "Task Dependencies"],
    docsUrl: "https://developers.asana.com",
    connectUrl: "https://app.asana.com",
  },
{
    id: "clickup",
    name: "ClickUp Work Management",
    category: "productivity",
    description:
      "Omnichannel task management, collaborative Doc wikis, sprint velocity tracking, and automated custom statuses.",
    icon: SiClickup,
    accent: "#7b68ee",
    tags: ["Omnichannel Tasks", "Doc Wiki", "Sprint Tracker", "Time Tracking"],
    docsUrl: "https://clickup.com/api",
    connectUrl: "https://app.clickup.com",
  },
{
    id: "obsidian",
    name: "Obsidian Knowledge Graph",
    category: "productivity",
    description:
      "Local Markdown vault sync, bidirectional wikilink graph exploration, frontmatter metadata indexing, and offline-first notes.",
    icon: SiObsidian,
    accent: "#805ad5",
    tags: ["Local Markdown Vault", "Graph View", "Bi-directional Links", "Offline First"],
    docsUrl: "https://obsidian.md/help",
    connectUrl: "https://obsidian.md",
  },
{
    id: "miro",
    name: "Miro Infinite Canvas",
    category: "productivity",
    description:
      "System architecture diagram generation, sticky note ideation boards, agile retrospective mapping, and visual workflows.",
    icon: SiMiro,
    accent: "#ffd02f",
    tags: ["Infinite Canvas", "System Architecture", "Sticky Notes", "Wireframing"],
    docsUrl: "https://developers.miro.com",
    connectUrl: "https://miro.com/app",
  },
{
    id: "loom",
    name: "Loom Async Video",
    category: "productivity",
    description:
      "Async screen recording indexing, automatic transcript extraction, chapter summaries, and bug walkthrough clips.",
    icon: SiLoom,
    accent: "#ff5c35",
    tags: ["Async Screen Video", "Transcript Extraction", "AI Summary", "Instant Share"],
    docsUrl: "https://dev.loom.com",
    connectUrl: "https://www.loom.com",
  },
{
    id: "zoom",
    name: "Zoom Video & Transcripts",
    category: "productivity",
    description:
      "Meeting recording audio transcription, action-item extraction, webinar scheduling, and team chat notifications.",
    icon: SiZoom,
    accent: "#2d8cff",
    tags: ["Meeting Recording", "Smart Transcript", "Webinar Scheduling", "Cloud Storage"],
    docsUrl: "https://marketplace.zoom.us/docs",
    connectUrl: "https://zoom.us/signin",
  },
{
    id: "dropbox",
    name: "Dropbox Cloud Storage",
    category: "productivity",
    description:
      "Cross-platform document synchronization, Paper document drafting, large file transfer links, and revision history.",
    icon: SiDropbox,
    accent: "#0061ff",
    tags: ["File Sync Engine", "Shared Paper", "Transfer Portal", "Version History"],
    docsUrl: "https://www.dropbox.com/developers",
    connectUrl: "https://www.dropbox.com/home",
  },
{
    id: "box",
    name: "Box Enterprise Content",
    category: "productivity",
    description:
      "Enterprise content management, digital signatures, compliance governance shields, and metadata querying.",
    icon: SiBox,
    accent: "#0061d5",
    tags: ["Enterprise Content", "Box Sign", "Governance Shield", "Metadata API"],
    docsUrl: "https://developer.box.com",
    connectUrl: "https://app.box.com",
  },
{
    id: "coda",
    name: "Coda Interactive Docs",
    category: "productivity",
    description:
      "Dynamic all-in-one docs, custom Coda Packs execution, formula-driven tables, and publishing pipelines.",
    icon: SiCoda,
    accent: "#f46a54",
    tags: ["Interactive Packs", "Formulas & Automation", "Doc Publishing", "Canvas UI"],
    docsUrl: "https://coda.io/developers/apis/v1",
    connectUrl: "https://coda.io",
  },
{
    id: "make",
    name: "Make Automation Scenarios",
    category: "ai",
    description:
      "Visual multi-step integration scenarios, router condition branching, payload transformations, and webhook listeners.",
    icon: SiMake,
    accent: "#6d3aee",
    badge: "Automation",
    tags: ["Visual Scenarios", "Multi-step Router", "Data Transformation", "Webhook Triggers"],
    docsUrl: "https://www.make.com/en/help",
    connectUrl: "https://us1.make.com",
  },
{
    id: "n8n",
    name: "n8n Workflow Automation",
    category: "ai",
    description:
      "Self-hosted node workflow engine, custom code execution nodes, AI agent tool chaining, and webhook triggers.",
    icon: SiN8N,
    accent: "#ea4b71",
    badge: "Open Workflow",
    tags: ["Self-hosted Orchestration", "AI Agent Nodes", "JavaScript Transform", "REST Endpoints"],
    docsUrl: "https://docs.n8n.io",
    connectUrl: "https://app.n8n.cloud",
  },
{
    id: "zendesk",
    name: "Zendesk Support Suite",
    category: "productivity",
    description:
      "Customer support ticket triage, knowledge base article lookup, SLA tracking, and automated macro responses.",
    icon: SiZendesk,
    accent: "#03363d",
    tags: ["Helpdesk Tickets", "Knowledge Base Sync", "Macros & Triggers", "Agent Workspace"],
    docsUrl: "https://developer.zendesk.com",
    connectUrl: "https://www.zendesk.com/login",
  },
{
    id: "intercom",
    name: "Intercom Customer Messenger",
    category: "productivity",
    description:
      "Live user conversations, product tour triggers, automated onboarding messaging, and customer tag updates.",
    icon: SiIntercom,
    accent: "#0057ff",
    tags: ["Live Messenger", "Customer Engagement", "Automated Tours", "Inbox Sync"],
    docsUrl: "https://developers.intercom.com",
    connectUrl: "https://app.intercom.com",
  },
{
    id: "mailchimp",
    name: "Mailchimp Email Engine",
    category: "productivity",
    description:
      "Newsletter campaign drafting, subscriber audience segmentation, open-rate analytics, and transactional emails.",
    icon: SiMailchimp,
    accent: "#ffe01b",
    tags: ["Newsletter Campaigns", "Audience Segmentation", "Transactional Email", "A/B Testing"],
    docsUrl: "https://mailchimp.com/developer",
    connectUrl: "https://login.mailchimp.com",
  },
{
    id: "shopify",
    name: "Shopify Merchant Platform",
    category: "productivity",
    description:
      "Storefront product catalog queries, inventory level updates, customer order tracking, and GraphQL Admin API sync.",
    icon: SiShopify,
    accent: "#95bf47",
    badge: "Commerce",
    tags: ["E-commerce Catalog", "Order Fulfillment", "Inventory Sync", "Storefront API"],
    docsUrl: "https://shopify.dev",
    connectUrl: "https://admin.shopify.com",
  },
{
    id: "quickbooks",
    name: "QuickBooks Financials",
    category: "productivity",
    description:
      "Automated invoice generation, expense categorization, tax ledger reconciliation, and profit-and-loss reports.",
    icon: SiQuickbooks,
    accent: "#2ca01c",
    tags: ["Invoicing", "Ledger Reconcile", "Expense Tracking", "Financial Reports"],
    docsUrl: "https://developer.intuit.com",
    connectUrl: "https://quickbooks.intuit.com",
  },
{
    id: "dribbble",
    name: "Dribbble Creative Network",
    category: "productivity",
    description:
      "Design inspiration scraping, UI/UX concept exploration, design portfolio asset indexing, and feedback loops.",
    icon: SiDribbble,
    accent: "#ea4c89",
    tags: ["Design Inspiration", "Shot Portfolios", "Creative Feedback", "Asset Download"],
    docsUrl: "https://developer.dribbble.com",
    connectUrl: "https://dribbble.com",
  },
{
    id: "unsplash",
    name: "Unsplash Asset Engine",
    category: "productivity",
    description:
      "High-resolution stock photography retrieval, semantic image search, automated hero image suggestions, and licensing.",
    icon: SiUnsplash,
    accent: "#ffffff",
    tags: ["HD Stock Imagery", "Visual Search API", "Creative Commons", "Asset Pipeline"],
    docsUrl: "https://unsplash.com/developers",
    connectUrl: "https://unsplash.com",
  },
{
    id: "x",
    name: "X / Twitter Feed & Publishing",
    category: "productivity",
    description:
      "Real-time social stream monitoring, thread scheduling, post publishing, and developer v2 API analytics.",
    icon: SiX,
    accent: "#ffffff",
    tags: ["Real-time Stream", "Thread Publishing", "V2 API Analytics", "Trend Monitoring"],
    docsUrl: "https://developer.x.com",
    connectUrl: "https://x.com",
  },
{
    id: "reddit",
    name: "Reddit Community API",
    category: "productivity",
    description:
      "Subreddit monitoring, technical community discussion parsing, comment sentiment analysis, and OAuth 2.0 integration.",
    icon: SiReddit,
    accent: "#ff4500",
    tags: ["Community Threads", "Subreddit Monitoring", "Sentiment Scraping", "OAuth 2.0"],
    docsUrl: "https://www.reddit.com/dev/api",
    connectUrl: "https://www.reddit.com",
  },
{
    id: "youtube",
    name: "YouTube Studio Content",
    category: "productivity",
    description:
      "Video performance analytics, automatic subtitle file generation, video metadata optimization, and stream health.",
    icon: SiYoutube,
    accent: "#ff0000",
    tags: ["Video Analytics", "Captions & Subtitles", "Content Scheduling", "Data API v3"],
    docsUrl: "https://developers.google.com/youtube/v3",
    connectUrl: "https://studio.youtube.com",
  },
{
    id: "medium",
    name: "Medium Editorial Hub",
    category: "productivity",
    description:
      "Draft article synchronization, Markdown blog publishing, publication curation, and readership metric tracking.",
    icon: SiMedium,
    accent: "#ffffff",
    tags: ["Article Publishing", "Editorial Markdown", "Publication Sync", "Draft Review"],
    docsUrl: "https://github.com/Medium/medium-api-docs",
    connectUrl: "https://medium.com",
  },
{
    id: "wordpress",
    name: "WordPress Headless Engine",
    category: "productivity",
    description:
      "Headless CMS post generation, Gutenberg block rendering, custom post type management, and REST API publishing.",
    icon: SiWordpress,
    accent: "#21759b",
    tags: ["Headless CMS", "Gutenberg Blocks", "REST API Engine", "Custom Taxonomies"],
    docsUrl: "https://developer.wordpress.org/rest-api",
    connectUrl: "https://wordpress.com",
  },
{
    id: "ghost",
    name: "Ghost Publishing CMS",
    category: "productivity",
    description:
      "Modern newsletter and blogging automation, Ghost Admin API content deployment, and member tier administration.",
    icon: SiGhost,
    accent: "#738a94",
    tags: ["Ghost Admin API", "Newsletter Engine", "Membership Tiers", "Content API"],
    docsUrl: "https://ghost.org/docs/admin-api",
    connectUrl: "https://ghost.org",
  },
{
    id: "huggingface",
    name: "Hugging Face Hub",
    category: "ai",
    description:
      "Open-weights repository access, dataset querying, serverless inference endpoints, and Spaces application sync.",
    icon: SiHuggingface,
    accent: "#ffd21e",
    badge: "Open Weights",
    tags: ["Model Hub", "Dataset Hub", "Inference Endpoints", "Spaces Containers"],
    docsUrl: "https://huggingface.co/docs",
    connectUrl: "https://huggingface.co/settings/tokens",
  },
{
    id: "replicate",
    name: "Replicate Serverless Compute",
    category: "ai",
    description:
      "Serverless cloud compute, custom container execution, image generation runtimes, and webhook streaming.",
    icon: SiReplicate,
    accent: "#ffffff",
    badge: "Serverless GPUs",
    tags: ["Serverless GPUs", "Diffusion Runtimes", "Custom Cog Containers", "Streaming Webhooks"],
    docsUrl: "https://replicate.com/docs",
    connectUrl: "https://replicate.com",
  },
{
    id: "qdrant",
    name: "Qdrant Vector Database",
    category: "cloud",
    description:
      "High-performance vector similarity search, payload metadata filtering, sparse vectors, and semantic memory indexing.",
    icon: SiQdrant,
    accent: "#dc2626",
    badge: "Vector DB",
    tags: ["HNSW Vector Search", "Payload Filtering", "Sparse Vectors", "Rust Performance"],
    docsUrl: "https://qdrant.tech/documentation",
    connectUrl: "https://cloud.qdrant.io",
  },
{
    id: "githubactions",
    name: "GitHub Actions CI/CD",
    category: "developer",
    description:
      "Workflow run telemetry, automated action trigger dispatch, matrix build log debugging, and pipeline generation.",
    icon: SiGithubactions,
    accent: "#2088ff",
    tags: ["CI/CD Matrix", "Automated Workflows", "Artifact Storage", "Secret Vault"],
    docsUrl: "https://docs.github.com/en/actions",
    connectUrl: "https://github.com/features/actions",
  },
{
    id: "circleci",
    name: "CircleCI Automation",
    category: "developer",
    description:
      "Config YAML optimization, Docker orb integration, parallel pipeline triggers, and continuous deployment tracking.",
    icon: SiCircleci,
    accent: "#343434",
    tags: ["Config YAML", "Docker Orbs", "Parallel Pipelines", "Test Analytics"],
    docsUrl: "https://circleci.com/docs",
    connectUrl: "https://app.circleci.com",
  },
{
    id: "prisma",
    name: "Prisma Studio & ORM",
    category: "developer",
    description:
      "Declarative schema definition, automated SQL migrations, Prisma Studio UI inspection, and Accelerate query caching.",
    icon: SiPrisma,
    accent: "#2d3748",
    tags: ["Schema Migrations", "Prisma Studio", "Type-safe Client", "Accelerate Cache"],
    docsUrl: "https://www.prisma.io/docs",
    connectUrl: "https://cloud.prisma.io",
  },
{
    id: "graphql",
    name: "GraphQL Federation Gateway",
    category: "developer",
    description:
      "Schema introspection, query and mutation drafting, subgraphs composition, and real-time WebSocket subscriptions.",
    icon: SiGraphql,
    accent: "#e10098",
    tags: ["Unified Graph", "Subgraphs Federation", "Query Introspection", "Real-time Subscriptions"],
    docsUrl: "https://graphql.org/learn",
    connectUrl: "https://graphql.org",
  },
{
    id: "swagger",
    name: "OpenAPI / SwaggerHub",
    category: "developer",
    description:
      "OpenAPI 3.1 contract authoring, schema linting, automated client SDK generation, and mock server routing.",
    icon: SiSwagger,
    accent: "#85ea2d",
    tags: ["API Specs 3.1", "Schema CodeGen", "Mock Servers", "Validation Linting"],
    docsUrl: "https://swagger.io/docs",
    connectUrl: "https://swagger.io/tools/swaggerhub",
  },
{
    id: "kafka",
    name: "Apache Kafka Event Stream",
    category: "cloud",
    description:
      "High-throughput message topic streaming, event replay, schema registry validation, and consumer offset tracking.",
    icon: SiApachekafka,
    accent: "#231f20",
    badge: "Streaming",
    tags: ["Event Streaming", "Topic Partitions", "Consumer Groups", "High-throughput PubSub"],
    docsUrl: "https://kafka.apache.org/documentation",
    connectUrl: "https://kafka.apache.org",
  },
{
    id: "rabbitmq",
    name: "RabbitMQ Message Broker",
    category: "cloud",
    description:
      "AMQP routing topologies, dead-letter queue management, exchange bindings, and asynchronous task delivery.",
    icon: SiRabbitmq,
    accent: "#ff6600",
    tags: ["AMQP Messaging", "Dead Letter Queues", "Topic Exchanges", "Broker Clustering"],
    docsUrl: "https://www.rabbitmq.com/docs",
    connectUrl: "https://www.rabbitmq.com",
  },
{
    id: "clickhouse",
    name: "ClickHouse Analytical DB",
    category: "cloud",
    description:
      "Real-time columnar OLAP queries, petabyte-scale event analytics, vector indexing, and ultra-fast data aggregations.",
    icon: SiClickhouse,
    accent: "#f9c80e",
    badge: "Columnar OLAP",
    tags: ["Columnar OLAP", "Vector Indexes", "Petabyte Analytics", "Fast Aggregation"],
    docsUrl: "https://clickhouse.com/docs",
    connectUrl: "https://clickhouse.com/cloud",
  },
{
    id: "cockroach",
    name: "CockroachDB Distributed SQL",
    category: "cloud",
    description:
      "Globally distributed transactional SQL, Postgres-compatible dialect, cross-region replication, and survival resilience.",
    icon: SiCockroachlabs,
    accent: "#6933ff",
    tags: ["Distributed SQL", "Global Resilience", "ACID Transactions", "Postgres Wire"],
    docsUrl: "https://www.cockroachlabs.com/docs",
    connectUrl: "https://cockroachlabs.cloud",
  },
{
    id: "duckdb",
    name: "DuckDB Analytical Engine",
    category: "cloud",
    description:
      "Embeddable in-process analytical SQL, Parquet and Arrow zero-copy analysis, and local WebAssembly query execution.",
    icon: SiDuckdb,
    accent: "#fff000",
    tags: ["In-process SQL", "Parquet Analysis", "WebAssembly Engine", "Zero-dependency Engine"],
    docsUrl: "https://duckdb.org/docs",
    connectUrl: "https://duckdb.org",
  },
{
    id: "neo4j",
    name: "Neo4j Knowledge Graph",
    category: "cloud",
    description:
      "Cypher graph traversal, interconnected entity resolution, Graph RAG contextual lookup, and AuraDB sync.",
    icon: SiNeo4J,
    accent: "#008cc1",
    badge: "Graph RAG",
    tags: ["Cypher Query", "Knowledge Graphs", "Graph RAG", "Entity Traversal"],
    docsUrl: "https://neo4j.com/docs",
    connectUrl: "https://neo4j.com/cloud/platform/aura-graph-database",
  },
{
    id: "firebase",
    name: "Firebase Cloud Platform",
    category: "cloud",
    description:
      "Cloud Firestore documents, realtime database listeners, Firebase Auth state, and Cloud Functions triggers.",
    icon: SiFirebase,
    accent: "#ffca28",
    tags: ["Cloud Firestore", "Authentication", "Cloud Functions", "Realtime DB"],
    docsUrl: "https://firebase.google.com/docs",
    connectUrl: "https://console.firebase.google.com",
  },
{
    id: "appwrite",
    name: "Appwrite Cloud BaaS",
    category: "cloud",
    description:
      "Open-source backend-as-a-service, serverless runtimes, file storage buckets, and OAuth user management.",
    icon: SiAppwrite,
    accent: "#f02e65",
    tags: ["Self-hosted BaaS", "Serverless Functions", "Realtime Storage", "OAuth Providers"],
    docsUrl: "https://appwrite.io/docs",
    connectUrl: "https://cloud.appwrite.io",
  },
{
    id: "microsoft365",
    name: "Microsoft 365 & Office",
    category: "productivity",
    description:
      "Word document authoring, Excel spreadsheet data analysis, PowerPoint slide generation, and Teams channel sync.",
    icon: FaMicrosoft,
    accent: "#00a4ef",
    badge: "Suite",
    tags: ["Word Docs", "Excel Workbooks", "PowerPoint Slides", "Teams Sync"],
    docsUrl: "https://developer.microsoft.com/en-us/graph",
    connectUrl: "https://www.office.com",
  },
{
    id: "linkedin",
    name: "LinkedIn Professional",
    category: "productivity",
    description:
      "Company page updates, professional network article publishing, industry research insights, and talent outreach.",
    icon: FaLinkedin,
    accent: "#0a66c2",
    tags: ["Professional Graph", "Article Publishing", "Company Updates", "InMail Outreach"],
    docsUrl: "https://developer.linkedin.com",
    connectUrl: "https://www.linkedin.com",
  },
{
    id: "googledocs",
    name: "Google Docs",
    category: "productivity",
    description: "Real-time document co-authoring, semantic paragraph rewriting, research citation drafting, and version diffing.",
    icon: SiGoogledocs,
    accent: "#4285f4",
    badge: "Docs",
    tags: ["Document Drafting", "Collaborative Notes", "Research Export"],
    docsUrl: "https://developers.google.com/docs",
    connectUrl: "https://docs.google.com",
  },
{
    id: "googlesheets",
    name: "Google Sheets",
    category: "productivity",
    description: "Natural language formula generation, automated financial modeling, pivot tables, and connected sheet sync.",
    icon: SiGooglesheets,
    accent: "#0f9d58",
    badge: "Spreadsheet",
    tags: ["Formulas & Macros", "Data Analysis", "Connected Sheets"],
    docsUrl: "https://developers.google.com/sheets",
    connectUrl: "https://sheets.google.com",
  },
{
    id: "googleslides",
    name: "Google Slides",
    category: "productivity",
    description: "Automated presentation deck outlining, keynote layout structuring, slide bullet refinement, and speaker notes.",
    icon: SiGoogleslides,
    accent: "#f4b400",
    tags: ["Slide Decks", "Keynote Outlines", "Speaker Notes"],
    docsUrl: "https://developers.google.com/slides",
    connectUrl: "https://slides.google.com",
  },
{
    id: "googlemeet",
    name: "Google Meet",
    category: "productivity",
    description: "Meeting transcript ingestion, action-item extraction, audio conference summaries, and calendar follow-ups.",
    icon: SiGooglemeet,
    accent: "#00897b",
    tags: ["Video Meetings", "Live Transcripts", "Action Items"],
    docsUrl: "https://developers.google.com/meet",
    connectUrl: "https://meet.google.com",
  },
{
    id: "googleforms",
    name: "Google Forms",
    category: "productivity",
    description: "Survey questionnaire authoring, customer feedback aggregation, response analytics, and automated quizzes.",
    icon: SiGoogleforms,
    accent: "#7248b9",
    tags: ["Survey Builder", "Feedback Forms", "Response Analytics"],
    docsUrl: "https://developers.google.com/forms",
    connectUrl: "https://forms.google.com",
  },
{
    id: "googlekeep",
    name: "Google Keep",
    category: "productivity",
    description: "Quick thought capture, checklist synchronization, audio note transcription, and color-coded idea boards.",
    icon: SiGooglekeep,
    accent: "#fbbc04",
    tags: ["Quick Notes", "Checklists", "Brainstorming"],
    docsUrl: "https://support.google.com/keep",
    connectUrl: "https://keep.google.com",
  },
{
    id: "googlecolab",
    name: "Google Colaboratory",
    category: "developer",
    description: "Cloud GPU Jupyter notebooks, Python snippet dispatch, experiment training curves, and dataset mounting.",
    icon: SiGooglecolab,
    accent: "#f9ab00",
    badge: "Cloud GPUs",
    tags: ["Jupyter Notebooks", "GPU Runtimes", "Python Science"],
    docsUrl: "https://colab.research.google.com",
    connectUrl: "https://colab.research.google.com",
  },
{
    id: "googlebigquery",
    name: "Google BigQuery",
    category: "cloud",
    description: "Serverless enterprise data warehouse, SQL query execution, petabyte data analysis, and predictive models.",
    icon: SiGooglebigquery,
    accent: "#669df6",
    badge: "Warehouse",
    tags: ["Serverless SQL", "Petabyte Analytics", "Data Lakehouse"],
    docsUrl: "https://cloud.google.com/bigquery/docs",
    connectUrl: "https://console.cloud.google.com/bigquery",
  },
{
    id: "googleanalytics",
    name: "Google Analytics 4",
    category: "productivity",
    description: "Web traffic funnel diagnostics, user cohort retention analysis, conversion event tracking, and traffic trends.",
    icon: SiGoogleanalytics,
    accent: "#e37400",
    tags: ["Traffic Funnels", "Event Tracking", "Cohort Analysis"],
    docsUrl: "https://developers.google.com/analytics",
    connectUrl: "https://analytics.google.com",
  },
{
    id: "googlesearchconsole",
    name: "Google Search Console",
    category: "productivity",
    description: "Organic search impressions, click-through rate auditing, sitemap indexing status, and SEO keyword ranking.",
    icon: SiGooglesearchconsole,
    accent: "#4587ef",
    tags: ["SEO Auditing", "Keyword Rankings", "Sitemap Indexing"],
    docsUrl: "https://developers.google.com/webmaster-tools",
    connectUrl: "https://search.google.com/search-console",
  },
{
    id: "duckduckgo",
    name: "DuckDuckGo Search",
    category: "ai",
    description: "Zero-tracker web search synthesis, anonymous instant answers, instant documentation scraping, and bangs.",
    icon: SiDuckduckgo,
    accent: "#de5833",
    badge: "Private Web",
    tags: ["Private Search", "Instant Answers", "Bang Directs"],
    docsUrl: "https://duckduckgo.com/about",
    connectUrl: "https://duckduckgo.com",
  },
{
    id: "brave",
    name: "Brave Search & Shield",
    category: "ai",
    description: "Independent search indexing, privacy-first web exploration, ad-block tracking shields, and Web3 crypto wallet.",
    icon: SiBrave,
    accent: "#fb542b",
    tags: ["Independent Index", "Privacy Shields", "Web Exploration"],
    docsUrl: "https://brave.com/search",
    connectUrl: "https://search.brave.com",
  },
{
    id: "digitalocean",
    name: "DigitalOcean Cloud",
    category: "cloud",
    description: "Droplet compute provisioning, managed Kubernetes clusters, block storage volumes, and App Platform CI/CD.",
    icon: SiDigitalocean,
    accent: "#0080ff",
    badge: "Cloud VMs",
    tags: ["Droplets", "Managed K8s", "App Platform", "Spaces Object Storage"],
    docsUrl: "https://docs.digitalocean.com",
    connectUrl: "https://cloud.digitalocean.com",
  },
{
    id: "render",
    name: "Render Cloud",
    category: "cloud",
    description: "Zero-config web services, background workers, managed Postgres databases, and automatic SSL deployments.",
    icon: SiRender,
    accent: "#46e3b7",
    tags: ["Web Services", "Static Sites", "Managed Databases", "Auto Deploy"],
    docsUrl: "https://render.com/docs",
    connectUrl: "https://dashboard.render.com",
  },
{
    id: "railway",
    name: "Railway Infrastructure",
    category: "cloud",
    description: "Instant container deployments, ephemeral environment previews, variable vaults, and relational databases.",
    icon: SiRailway,
    accent: "#0b0d0e",
    badge: "PaaS",
    tags: ["Instant Deploy", "Ephemeral Envs", "Plugins", "Volume Mounts"],
    docsUrl: "https://docs.railway.app",
    connectUrl: "https://railway.app",
  },
{
    id: "flyio",
    name: "Fly.io Global Edge",
    category: "cloud",
    description: "Global serverless microVMs running close to users, distributed SQLite via LiteFS, and wireguard mesh.",
    icon: SiFlydotio,
    accent: "#24185b",
    tags: ["MicroVMs", "Edge Regions", "LiteFS", "Global Anycast"],
    docsUrl: "https://fly.io/docs",
    connectUrl: "https://fly.io/dashboard",
  },
{
    id: "ansible",
    name: "Red Hat Ansible",
    category: "developer",
    description: "Agentless IT automation, configuration playbook validation, multi-node cloud orchestration, and provisioning.",
    icon: SiAnsible,
    accent: "#ee0000",
    tags: ["Playbooks", "Agentless Automation", "Config Management"],
    docsUrl: "https://docs.ansible.com",
    connectUrl: "https://www.ansible.com",
  },
{
    id: "helm",
    name: "Helm Kubernetes Charts",
    category: "developer",
    description: "Kubernetes package management, chart templating, release lifecycle rollback, and values overrides.",
    icon: SiHelm,
    accent: "#0f1689",
    tags: ["K8s Packages", "Chart Templates", "Release Management"],
    docsUrl: "https://helm.sh/docs",
    connectUrl: "https://helm.sh",
  },
{
    id: "argo",
    name: "Argo CD GitOps",
    category: "developer",
    description: "Declarative continuous delivery for Kubernetes, GitOps drift reconciliation, and automated rollouts.",
    icon: SiArgo,
    accent: "#ef7b4d",
    badge: "GitOps",
    tags: ["GitOps", "Kubernetes Sync", "Continuous Delivery"],
    docsUrl: "https://argo-cd.readthedocs.io",
    connectUrl: "https://argoproj.github.io/cd",
  },
{
    id: "prometheus",
    name: "Prometheus Telemetry",
    category: "developer",
    description: "Time-series systems monitoring, PromQL metric expressions, active scraping targets, and alert rules.",
    icon: SiPrometheus,
    accent: "#e6522c",
    tags: ["PromQL", "Time Series Monitoring", "Service Discovery"],
    docsUrl: "https://prometheus.io/docs",
    connectUrl: "https://prometheus.io",
  },
{
    id: "traefik",
    name: "Traefik Edge Router",
    category: "developer",
    description: "Cloud native ingress routing, automatic microservice discovery, middleware pipelines, and TLS certs.",
    icon: SiTraefikproxy,
    accent: "#24a1c1",
    tags: ["Ingress Routing", "Service Discovery", "Middleware", "Cloud Native"],
    docsUrl: "https://doc.traefik.io/traefik",
    connectUrl: "https://traefik.io",
  },
{
    id: "podman",
    name: "Podman Rootless Containers",
    category: "developer",
    description: "Daemonless and rootless OCI container execution, pod generation, Docker compose compatibility, and images.",
    icon: SiPodman,
    accent: "#892ca0",
    tags: ["Rootless Containers", "OCI Specs", "Daemonless", "Pods"],
    docsUrl: "https://docs.podman.io",
    connectUrl: "https://podman.io",
  },
{
    id: "auth0",
    name: "Auth0 by Okta",
    category: "developer",
    description: "Universal login authentication, OAuth 2.0 / OIDC tokens, multi-factor auth rules, and user profile management.",
    icon: SiAuth0,
    accent: "#eb5424",
    badge: "Identity",
    tags: ["OAuth 2.0 / OIDC", "Social Logins", "MFA Security", "JWT Claims"],
    docsUrl: "https://auth0.com/docs",
    connectUrl: "https://manage.auth0.com",
  },
{
    id: "clerk",
    name: "Clerk Authentication",
    category: "developer",
    description: "Modern user management, passwordless email codes, organization RBAC permissions, and webhook sync.",
    icon: SiClerk,
    accent: "#6c47ff",
    badge: "Modern Auth",
    tags: ["User Management", "Passkeys", "Org Permissions", "React SDK"],
    docsUrl: "https://clerk.com/docs",
    connectUrl: "https://dashboard.clerk.com",
  },
{
    id: "okta",
    name: "Okta Enterprise Identity",
    category: "developer",
    description: "Single Sign-On (SSO), SAML 2.0 directory federation, SCIM user provisioning, and zero trust policies.",
    icon: SiOkta,
    accent: "#007dc1",
    badge: "Enterprise SSO",
    tags: ["Enterprise SSO", "SAML 2.0", "SCIM Provisioning", "Zero Trust"],
    docsUrl: "https://developer.okta.com",
    connectUrl: "https://www.okta.com",
  },
{
    id: "onepassword",
    name: "1Password Secrets Vault",
    category: "developer",
    description: "Secrets management, developer CLI vault integration, service account tokens, and secure credential injection.",
    icon: Si1Password,
    accent: "#0a85ea",
    tags: ["Secrets Automation", "Vault Sync", "Service Accounts", "CLI Integration"],
    docsUrl: "https://developer.1password.com",
    connectUrl: "https://1password.com",
  },
{
    id: "bitwarden",
    name: "Bitwarden Vault",
    category: "developer",
    description: "Open-source credential vaulting, secrets manager CLI, end-to-end zero knowledge encryption, and team shares.",
    icon: SiBitwarden,
    accent: "#175ddc",
    tags: ["Open Source Vault", "Zero Knowledge", "Team Sharing", "Secrets CLI"],
    docsUrl: "https://bitwarden.com/help",
    connectUrl: "https://vault.bitwarden.com",
  },
{
    id: "cypress",
    name: "Cypress Testing Cloud",
    category: "developer",
    description: "End-to-end browser test suites, DOM time-travel debugging, network stubbing, and CI test parallelization.",
    icon: SiCypress,
    accent: "#69d3a7",
    tags: ["E2E Testing", "Time Travel Debug", "Component Testing", "Network Mock"],
    docsUrl: "https://docs.cypress.io",
    connectUrl: "https://cloud.cypress.io",
  },
{
    id: "jest",
    name: "Jest Test Framework",
    category: "developer",
    description: "Delightful JavaScript unit testing, snapshot assertions, automated mock functions, and code coverage tables.",
    icon: SiJest,
    accent: "#c21325",
    tags: ["Unit Testing", "Snapshots", "Mocking", "Code Coverage"],
    docsUrl: "https://jestjs.io/docs/getting-started",
    connectUrl: "https://jestjs.io",
  },
{
    id: "vitest",
    name: "Vitest Next-Gen Runner",
    category: "developer",
    description: "Vite-native unit and component test runner, ESM-first execution, workspace test filtering, and instant HMR.",
    icon: SiVitest,
    accent: "#729b1b",
    badge: "Blazing Fast",
    tags: ["Vite Native", "ESM Testing", "Component Tests", "Watch Mode"],
    docsUrl: "https://vitest.dev/guide",
    connectUrl: "https://vitest.dev",
  },
{
    id: "sonarqube",
    name: "SonarQube Code Quality",
    category: "developer",
    description: "Static code analysis, vulnerability scanning, technical debt calculations, and quality gate automation.",
    icon: SiSonar,
    accent: "#4b9fd5",
    tags: ["Static Analysis", "Security Hotspots", "Tech Debt", "Quality Gates"],
    docsUrl: "https://docs.sonarqube.org",
    connectUrl: "https://www.sonarqube.org",
  },
{
    id: "codecov",
    name: "Codecov Telemetry",
    category: "developer",
    description: "Continuous code coverage reporting, PR coverage drop warnings, test impact analysis, and flags.",
    icon: SiCodecov,
    accent: "#f01f7a",
    tags: ["Test Coverage", "PR Status Checks", "Impact Analysis"],
    docsUrl: "https://docs.codecov.com",
    connectUrl: "https://about.codecov.io",
  },
{
    id: "mysql",
    name: "MySQL Database Engine",
    category: "cloud",
    description: "World's most popular open-source relational database, InnoDB transactions, replica clustering, and schemas.",
    icon: SiMysql,
    accent: "#4479a1",
    tags: ["Relational SQL", "InnoDB", "Replication", "ACID Storage"],
    docsUrl: "https://dev.mysql.com/doc",
    connectUrl: "https://www.mysql.com",
  },
{
    id: "mariadb",
    name: "MariaDB Enterprise",
    category: "cloud",
    description: "High performance drop-in relational engine, Galera multi-master clustering, columnstore analytics, and JSON.",
    icon: SiMariadb,
    accent: "#003545",
    tags: ["Galera Cluster", "Columnstore", "Open Source SQL", "JSON Path"],
    docsUrl: "https://mariadb.com/kb",
    connectUrl: "https://mariadb.org",
  },
{
    id: "sqlite",
    name: "SQLite In-Process Engine",
    category: "cloud",
    description: "Zero-configuration embedded SQL database, single file portability, in-memory caching, and edge durability.",
    icon: SiSqlite,
    accent: "#003b57",
    badge: "Embedded",
    tags: ["Zero Config", "Single File DB", "In-Memory", "Wasm Compatible"],
    docsUrl: "https://www.sqlite.org/docs.html",
    connectUrl: "https://www.sqlite.org",
  },
{
    id: "minio",
    name: "MinIO High Performance S3",
    category: "cloud",
    description: "S3-compatible object storage server, kubernetes-native object buckets, encryption at rest, and replication.",
    icon: SiMinio,
    accent: "#c72c48",
    tags: ["S3 Compatible", "Object Storage", "Multi-cloud Buckets", "High IOPS"],
    docsUrl: "https://min.io/docs/minio/linux/index.html",
    connectUrl: "https://min.io",
  },
{
    id: "cassandra",
    name: "Apache Cassandra",
    category: "cloud",
    description: "Distributed wide-column NoSQL database, peer-to-peer masterless architecture, and linear horizontal scale.",
    icon: SiApachecassandra,
    accent: "#1287b1",
    badge: "High Write",
    tags: ["Wide Column NoSQL", "Masterless Architecture", "Linear Scale"],
    docsUrl: "https://cassandra.apache.org/doc/latest",
    connectUrl: "https://cassandra.apache.org",
  },
{
    id: "fauna",
    name: "Fauna Serverless Document DB",
    category: "cloud",
    description: "Strongly consistent document-relational database, FQL v10 query language, GraphQL API, and zero DevOps.",
    icon: SiFauna,
    accent: "#3a1ab6",
    tags: ["Serverless Document", "FQL v10", "Strict Consistency", "Zero DevOps"],
    docsUrl: "https://docs.fauna.com",
    connectUrl: "https://dashboard.fauna.com",
  },
{
    id: "influxdb",
    name: "InfluxDB Time-Series Engine",
    category: "cloud",
    description: "High-throughput time-series platform, IoT sensor ingestion, real-time downsampling, and SQL analytics.",
    icon: SiInfluxdb,
    accent: "#22adf6",
    tags: ["Time Series Data", "IoT Metrics", "Downsampling", "Realtime Dashboards"],
    docsUrl: "https://docs.influxdata.com",
    connectUrl: "https://cloud2.influxdata.com",
  },
{
    id: "timescale",
    name: "TimescaleDB Hypertable SQL",
    category: "cloud",
    description: "PostgreSQL engineered for time-series, hypertables automatic partitioning, continuous aggregates, and compression.",
    icon: SiTimescale,
    accent: "#fdb515",
    tags: ["Postgres Hypertables", "Continuous Aggregates", "Data Compression"],
    docsUrl: "https://docs.timescale.com",
    connectUrl: "https://console.cloud.timescale.com",
  },
{
    id: "planetscale",
    name: "PlanetScale Database",
    category: "cloud",
    description: "Serverless MySQL platform powered by Vitess, non-blocking schema branching, read replica autoscaling, and metrics.",
    icon: SiPlanetscale,
    accent: "#000000",
    badge: "Vitess Scale",
    tags: ["Schema Branching", "Non-blocking DDL", "Vitess Engine", "Zero Downtime"],
    docsUrl: "https://planetscale.com/docs",
    connectUrl: "https://app.planetscale.com",
  },
{
    id: "upstash",
    name: "Upstash Serverless Redis",
    category: "cloud",
    description: "Serverless Redis & Kafka with REST APIs, edge-compatible token bucket rate limiting, and QStash scheduler.",
    icon: SiUpstash,
    accent: "#00e9a3",
    badge: "Edge Redis",
    tags: ["Serverless Redis", "Rate Limiting", "QStash Messaging", "Edge Rest API"],
    docsUrl: "https://docs.upstash.com",
    connectUrl: "https://console.upstash.com",
  },
{
    id: "surrealdb",
    name: "SurrealDB Multi-Model",
    category: "cloud",
    description: "Relational, document, graph, and vector database in a single engine with SurrealQL and live subscriptions.",
    icon: SiSurrealdb,
    accent: "#ff00a0",
    tags: ["Multi-model Engine", "SurrealQL", "Graph & Vector", "Realtime Subscriptions"],
    docsUrl: "https://surrealdb.com/docs",
    connectUrl: "https://surrealdb.com",
  },
{
    id: "bun",
    name: "Bun High-Performance Runtime",
    category: "developer",
    description: "All-in-one JavaScript & TypeScript toolkit, ultra-fast bundler, built-in test runner, and package manager.",
    icon: SiBun,
    accent: "#fbf0df",
    badge: "High Speed",
    tags: ["TypeScript Runtime", "Fast Bundler", "Built-in Test Runner", "Zero Config"],
    docsUrl: "https://bun.sh/docs",
    connectUrl: "https://bun.sh",
  },
{
    id: "deno",
    name: "Deno Modern Runtime",
    category: "developer",
    description: "Secure runtime for JavaScript, TypeScript, and WebAssembly with built-in permission security flags and Deno Deploy.",
    icon: SiDeno,
    accent: "#ffffff",
    tags: ["Secure By Default", "Deno Deploy", "TypeScript Native", "Web Standards"],
    docsUrl: "https://docs.deno.com",
    connectUrl: "https://deno.com",
  },
{
    id: "vite",
    name: "Vite Frontend Tooling",
    category: "developer",
    description: "Instant server start with native ESM, lightning-fast Hot Module Replacement (HMR), and Rollup production builds.",
    icon: SiVite,
    accent: "#646cff",
    badge: "Next Gen Dev",
    tags: ["Lightning HMR", "ESM Bundler", "Rollup Production", "Plugin Ecosystem"],
    docsUrl: "https://vite.dev/guide",
    connectUrl: "https://vite.dev",
  },
{
    id: "nextjs",
    name: "Next.js React Framework",
    category: "developer",
    description: "Server components, App Router architecture, automated image optimization, and incremental static generation.",
    icon: SiNextdotjs,
    accent: "#ffffff",
    badge: "React Leader",
    tags: ["Server Components", "App Router", "SSR & SSG", "Edge Middleware"],
    docsUrl: "https://nextjs.org/docs",
    connectUrl: "https://nextjs.org",
  },
{
    id: "nuxtjs",
    name: "Nuxt Vue Framework",
    category: "developer",
    description: "Intuitive Vue.js fullstack framework with Nitro server engine, automated file-based routing, and SSR hydration.",
    icon: SiNuxt,
    accent: "#00dc82",
    tags: ["Vue Fullstack", "Nitro Engine", "File Routing", "Server Engine"],
    docsUrl: "https://nuxt.com/docs",
    connectUrl: "https://nuxt.com",
  },
{
    id: "svelte",
    name: "SvelteKit Web Framework",
    category: "developer",
    description: "Cybernetically enhanced web apps without virtual DOM overhead, compile-time reactivity, and streaming loads.",
    icon: SiSvelte,
    accent: "#ff3e00",
    tags: ["No Virtual DOM", "Compile Reactivity", "Edge Adapters", "Lightweight"],
    docsUrl: "https://svelte.dev/docs",
    connectUrl: "https://svelte.dev",
  },
{
    id: "astro",
    name: "Astro Content Framework",
    category: "developer",
    description: "Zero-JS by default island architecture, multi-framework component rendering, and content collection schemas.",
    icon: SiAstro,
    accent: "#ff5d01",
    tags: ["Islands Architecture", "Zero JS Default", "Content Collections", "Fast Static"],
    docsUrl: "https://docs.astro.build",
    connectUrl: "https://astro.build",
  },
{
    id: "pytorch",
    name: "PyTorch Deep Learning",
    category: "ai",
    description: "Dynamic computational graph execution, GPU tensor acceleration, neural network layers, and TorchScript export.",
    icon: SiPytorch,
    accent: "#ee4c2c",
    badge: "Deep Learning",
    tags: ["Tensors", "Autograd Engine", "GPU Acceleration", "TorchScript"],
    docsUrl: "https://pytorch.org/docs",
    connectUrl: "https://pytorch.org",
  },
{
    id: "tensorflow",
    name: "TensorFlow Engine",
    category: "ai",
    description: "End-to-end open source machine learning platform, Keras model training, TF Serving deployment, and quantization.",
    icon: SiTensorflow,
    accent: "#ff6f00",
    tags: ["Machine Learning", "TF Serving", "Edge Quantization", "Keras APIs"],
    docsUrl: "https://www.tensorflow.org/learn",
    connectUrl: "https://www.tensorflow.org",
  },
{
    id: "jupyter",
    name: "Jupyter Notebooks",
    category: "developer",
    description: "Interactive computational notebook environment supporting multiple kernels, inline chart plotting, and markdown.",
    icon: SiJupyter,
    accent: "#f37626",
    tags: ["Interactive Notebooks", "Data Science", "Multi-kernel", "Inline Charts"],
    docsUrl: "https://jupyter.org/documentation",
    connectUrl: "https://jupyter.org",
  },
{
    id: "wandb",
    name: "Weights & Biases",
    category: "ai",
    description: "Experiment tracking for machine learning, hyperparameter tuning sweeps, dataset artifact versioning, and charts.",
    icon: SiWeightsandbiases,
    accent: "#ffbe00",
    badge: "MLOps",
    tags: ["Experiment Tracking", "Model Sweeps", "Artifact Versioning", "Loss Curves"],
    docsUrl: "https://docs.wandb.ai",
    connectUrl: "https://wandb.ai/site",
  },
{
    id: "mlflow",
    name: "MLflow Lifecycle",
    category: "ai",
    description: "End-to-end machine learning lifecycle management, model registry governance, project packaging, and tracking.",
    icon: SiMlflow,
    accent: "#0194e2",
    tags: ["Model Registry", "Lifecycle Governance", "Deployment", "Metrics Logging"],
    docsUrl: "https://mlflow.org/docs/latest/index.html",
    connectUrl: "https://mlflow.org",
  },
{
    id: "spark",
    name: "Apache Spark Engine",
    category: "cloud",
    description: "Unified engine for large-scale data processing, resilient distributed datasets (RDDs), Spark SQL, and streaming.",
    icon: SiApachespark,
    accent: "#e25a1c",
    badge: "Big Data",
    tags: ["Distributed Compute", "Spark SQL", "Streaming ETL", "Large Scale Processing"],
    docsUrl: "https://spark.apache.org/docs/latest",
    connectUrl: "https://spark.apache.org",
  },
{
    id: "airflow",
    name: "Apache Airflow Orchestration",
    category: "cloud",
    description: "Programmatic workflow authoring, directed acyclic graph (DAG) scheduling, task monitoring, and operators.",
    icon: SiApacheairflow,
    accent: "#017cee",
    badge: "DAG Engine",
    tags: ["DAG Pipelines", "Task Scheduling", "Data Engineering", "Custom Operators"],
    docsUrl: "https://airflow.apache.org/docs",
    connectUrl: "https://airflow.apache.org",
  },
{
    id: "ray",
    name: "Ray Distributed Compute",
    category: "ai",
    description: "Unified compute framework for scaling AI and Python applications across distributed cloud clusters with Ray Train.",
    icon: SiRay,
    accent: "#028cf0",
    badge: "Cluster Compute",
    tags: ["Distributed Python", "Model Training Scale", "Ray Serve", "Cluster Orchestration"],
    docsUrl: "https://docs.ray.io",
    connectUrl: "https://www.ray.io",
  },
{
    id: "telegram",
    name: "Telegram Bot & Channel API",
    category: "productivity",
    description: "Instant bot messaging, automated channel broadcasts, custom keyboard commands, and real-time webhook listeners.",
    icon: SiTelegram,
    accent: "#26a5e4",
    badge: "Messenger",
    tags: ["Bot API", "Channel Broadcasts", "Webhook Alerts", "Custom Commands"],
    docsUrl: "https://core.telegram.org/bots/api",
    connectUrl: "https://t.me/BotFather",
  },
{
    id: "whatsapp",
    name: "WhatsApp Business Cloud",
    category: "productivity",
    description: "Official business messaging templates, automated customer notifications, interactive messages, and webhook sync.",
    icon: SiWhatsapp,
    accent: "#25d366",
    tags: ["Business Cloud API", "Interactive Messages", "Message Templates", "Notifications"],
    docsUrl: "https://developers.facebook.com/docs/whatsapp",
    connectUrl: "https://business.whatsapp.com",
  },
{
    id: "signal",
    name: "Signal Private Messenger",
    category: "productivity",
    description: "End-to-end encrypted private messaging protocol integration, group notifications, and privacy-preserving alerts.",
    icon: SiSignal,
    accent: "#3a76f0",
    tags: ["End-to-End Encrypted", "Private Alerts", "Group Messaging"],
    docsUrl: "https://signal.org/docs",
    connectUrl: "https://signal.org",
  },
{
    id: "matrix",
    name: "Matrix Decentralized Protocol",
    category: "productivity",
    description: "Decentralized federated real-time communications, secure end-to-end encrypted room messaging, and bridges.",
    icon: SiMatrix,
    accent: "#000000",
    tags: ["Decentralized Protocol", "Federated Rooms", "E2EE", "Bridge Connectors"],
    docsUrl: "https://matrix.org/docs",
    connectUrl: "https://matrix.org",
  },
{
    id: "discourse",
    name: "Discourse Community Forum",
    category: "productivity",
    description: "Modern community forum integration, topic creation, category sync, user badge tracking, and webhook triggers.",
    icon: SiDiscourse,
    accent: "#231f20",
    tags: ["Community Forums", "Topic Sync", "Discussions", "User Karma"],
    docsUrl: "https://docs.discourse.org",
    connectUrl: "https://www.discourse.org",
  },
{
    id: "basecamp",
    name: "Basecamp Project Hub",
    category: "productivity",
    description: "All-in-one project management, campfire team messages, to-do list automation, and message board synchronization.",
    icon: SiBasecamp,
    accent: "#27a858",
    tags: ["Campfire Chat", "To-do Checklists", "Message Boards", "Schedule Tracking"],
    docsUrl: "https://github.com/basecamp/bc3-api",
    connectUrl: "https://basecamp.com",
  },
{
    id: "paypal",
    name: "PayPal Merchant Platform",
    category: "productivity",
    description: "Merchant checkout orders, subscription billing recurring payments, dispute webhooks, and payout transfers.",
    icon: SiPaypal,
    accent: "#003087",
    badge: "Payments",
    tags: ["Checkout Orders", "Subscriptions", "Payouts API", "Dispute Webhooks"],
    docsUrl: "https://developer.paypal.com/docs/api/overview",
    connectUrl: "https://developer.paypal.com",
  },
{
    id: "square",
    name: "Square Terminal & POS",
    category: "productivity",
    description: "In-person POS terminal synchronization, catalog item inventory, customer cards, and transaction records.",
    icon: SiSquare,
    accent: "#ffffff",
    tags: ["Point of Sale", "Catalog Items", "Customer Loyalty", "Payment Vault"],
    docsUrl: "https://developer.squareup.com/docs",
    connectUrl: "https://developer.squareup.com",
  },
{
    id: "wise",
    name: "Wise Global Banking",
    category: "productivity",
    description: "International multi-currency accounts, real-time mid-market exchange rates, cross-border business payouts.",
    icon: SiWise,
    accent: "#9fe870",
    tags: ["Multi-currency", "FX Exchange Rates", "Global Payouts", "Batch Payments"],
    docsUrl: "https://wise.com/developer/docs",
    connectUrl: "https://wise.com",
  },
{
    id: "coinbase",
    name: "Coinbase Developer Platform",
    category: "productivity",
    description: "Web3 smart contract wallets, crypto checkout commerce, onchain balance queries, and trade webhooks.",
    icon: SiCoinbase,
    accent: "#0052ff",
    badge: "Web3",
    tags: ["Onchain Wallets", "Crypto Checkout", "Smart Contracts", "Trade Webhooks"],
    docsUrl: "https://docs.cdp.coinbase.com",
    connectUrl: "https://cloud.coinbase.com",
  },
{
    id: "framer",
    name: "Framer Interactive Canvas",
    category: "productivity",
    description: "Interactive web publishing, React component export, dynamic visual animations, and responsive breakpoints.",
    icon: SiFramer,
    accent: "#0055ff",
    tags: ["Interactive Design", "React Components", "Animations", "Web Publishing"],
    docsUrl: "https://www.framer.com/developers",
    connectUrl: "https://www.framer.com",
  },
{
    id: "blender",
    name: "Blender 3D Suite",
    category: "productivity",
    description: "3D geometry pipeline, Python script automation, Cycles and Eevee render farm triggers, and asset export.",
    icon: SiBlender,
    accent: "#ea7600",
    badge: "3D Suite",
    tags: ["3D Modeling", "Cycles Render", "Python Scripting", "Asset Pipeline"],
    docsUrl: "https://docs.blender.org",
    connectUrl: "https://www.blender.org",
  },
{
    id: "sketch",
    name: "Sketch Vector Design",
    category: "productivity",
    description: "Vector UI symbols, shared design libraries, design token export, and developer handoff inspection.",
    icon: SiSketch,
    accent: "#f7b500",
    tags: ["Vector UI", "Symbols & Tokens", "Design Systems", "Developer Handoff"],
    docsUrl: "https://developer.sketch.com",
    connectUrl: "https://www.sketch.com",
  },
  {
    id: "azure",
    name: "Microsoft Azure Cloud",
    category: "cloud",
    description: "Virtual machines, AKS clusters, Azure Cosmos DB, Blob Storage, and enterprise cloud resource management.",
    icon: VscAzure,
    accent: "#0089d6",
    badge: "Enterprise Cloud",
    tags: ["Azure Cloud", "Cosmos DB", "AKS", "Blob Storage"],
    docsUrl: "https://learn.microsoft.com/azure",
    connectUrl: "https://portal.azure.com",
  },
  {
    id: "azuredevops",
    name: "Azure DevOps",
    category: "developer",
    description: "Azure Boards agile planning, Repos Git repositories, CI/CD Pipelines, and cloud artifact packaging.",
    icon: VscAzureDevops,
    accent: "#0078d7",
    badge: "DevOps",
    tags: ["Azure Pipelines", "Azure Boards", "Repos", "Artifacts"],
    docsUrl: "https://learn.microsoft.com/azure/devops",
    connectUrl: "https://dev.azure.com",
  },
  {
    id: "pinecone",
    name: "Pinecone Vector Database",
    category: "cloud",
    description: "Serverless vector database designed for high-scale semantic search, metadata filtering, and real-time agent memory.",
    icon: Database,
    accent: "#000000",
    badge: "Vector DB",
    tags: ["Serverless Vector", "Semantic Index", "Metadata Filters", "Fast Retrieval"],
    docsUrl: "https://docs.pinecone.io",
    connectUrl: "https://app.pinecone.io",
  },
  {
    id: "weaviate",
    name: "Weaviate Cloud",
    category: "cloud",
    description: "Cloud-native open-source vector search engine, hybrid BM25 and dense retrieval, and multi-modal vector search.",
    icon: Database,
    accent: "#00d68f",
    badge: "Hybrid Search",
    tags: ["Hybrid Search", "Dense Vectors", "Multi-modal Search", "Graph Vectors"],
    docsUrl: "https://weaviate.io/developers/weaviate",
    connectUrl: "https://console.weaviate.cloud",
  },
  {
    id: "chroma",
    name: "Chroma Vector DB",
    category: "cloud",
    description: "AI-native open-source embedding database for document ingestion, collection queries, and long-term agent memory.",
    icon: Database,
    accent: "#ff4b4b",
    tags: ["Embeddings Store", "Collections", "Semantic Memory", "Open Source DB"],
    docsUrl: "https://docs.trychroma.com",
    connectUrl: "https://www.trychroma.com",
  },
  {
    id: "newrelic",
    name: "New Relic Observability",
    category: "developer",
    description: "Full-stack cloud telemetry, synthetic browser monitoring, APM transaction tracing, and anomaly alerts.",
    icon: SiNewrelic,
    accent: "#008c99",
    badge: "Full-stack APM",
    tags: ["Full Stack Telemetry", "Synthetic Tests", "APM Tracing", "Anomaly Alerts"],
    docsUrl: "https://docs.newrelic.com",
    connectUrl: "https://one.newrelic.com",
  },
  {
    id: "raycast",
    name: "Raycast Quick Launcher",
    category: "productivity",
    description: "Blazingly fast desktop command bar, custom script commands, extension store integration, and window tools.",
    icon: SiRaycast,
    accent: "#ff6363",
    badge: "Desktop AI",
    tags: ["Desktop Launcher", "Script Commands", "Quick Actions", "Extension Store"],
    docsUrl: "https://manual.raycast.com",
    connectUrl: "https://www.raycast.com",
  },
  {
    id: "monday",
    name: "Monday.com Work OS",
    category: "productivity",
    description: "Custom team boards, project portfolio dashboards, visual Gantt roadmaps, and automated workflow triggers.",
    icon: Workflow,
    accent: "#ff3d57",
    tags: ["Work OS", "Gantt Roadmaps", "Portfolio Tracking", "Team Boards"],
    docsUrl: "https://developer.monday.com",
    connectUrl: "https://auth.monday.com",
  },
  {
    id: "canva",
    name: "Canva Creative Studio",
    category: "productivity",
    description: "Visual design creation, social media banner templates, presentation layouts, and brand asset library sync.",
    icon: Palette,
    accent: "#00c4cc",
    badge: "Creative",
    tags: ["Visual Design", "Templates", "Brand Kits", "Presentations"],
    docsUrl: "https://www.canva.dev",
    connectUrl: "https://www.canva.com",
  },
  {
    id: "twilio",
    name: "Twilio Communications",
    category: "productivity",
    description: "Programmatic SMS delivery, WhatsApp messaging, international voice calls, verification OTPs, and SIP trunking.",
    icon: Phone,
    accent: "#f22f46",
    badge: "Telecom",
    tags: ["Programmatic SMS", "Voice Calls", "WhatsApp API", "OTP Verify"],
    docsUrl: "https://www.twilio.com/docs",
    connectUrl: "https://console.twilio.com",
  },
  {
    id: "sendgrid",
    name: "SendGrid Email API",
    category: "productivity",
    description: "Enterprise transactional email delivery, marketing automation, dynamic handlebars templates, and SMTP relays.",
    icon: Mail,
    accent: "#1a82e2",
    tags: ["Transactional Email", "SMTP Relay", "Dynamic Templates", "Deliverability"],
    docsUrl: "https://docs.sendgrid.com",
    connectUrl: "https://app.sendgrid.com",
  },
  {
    id: "puppeteer",
    name: "Puppeteer Browser Automation",
    category: "ai",
    description: "Headless Chrome automation, full-page screenshot rendering, PDF generation, and client-side SPA web scraping.",
    icon: SiPuppeteer,
    accent: "#00d8a2",
    badge: "Headless Web",
    tags: ["Headless Chrome", "Web Scraping", "DOM Automation", "PDF Render"],
    docsUrl: "https://pptr.dev",
    connectUrl: "https://pptr.dev",
  },
  {
    id: "playwright",
    name: "Playwright Browser Suite",
    category: "ai",
    description: "Cross-browser end-to-end automation, multi-tab web agents, network request interception, and resilient locators.",
    icon: Globe,
    accent: "#2eade2",
    badge: "Browser Agent",
    tags: ["Cross-browser", "Agent Scraping", "Network Mock", "Auto-waiting"],
    docsUrl: "https://playwright.dev/docs/intro",
    connectUrl: "https://playwright.dev",
  },
  {
    id: "tavily",
    name: "Tavily AI Search Engine",
    category: "ai",
    description: "Search engine purpose-built for AI agents, aggregated factual results, clean markdown extraction, and source ranking.",
    icon: Globe,
    accent: "#5046e5",
    badge: "AI Search",
    tags: ["Agent Search", "Factual Results", "Clean Markdown", "Real-time Web"],
    docsUrl: "https://docs.tavily.com",
    connectUrl: "https://tavily.com",
  },
  {
    id: "firecrawl",
    name: "Firecrawl Web Scraper",
    category: "ai",
    description: "Turns entire websites into clean LLM-ready markdown, recursive site crawler, JS execution, and subpage discovery.",
    icon: Flame,
    accent: "#ff5a1f",
    badge: "Web Crawler",
    tags: ["Clean Markdown", "Recursive Crawler", "Site Extraction", "LLM-Ready"],
    docsUrl: "https://docs.firecrawl.dev",
    connectUrl: "https://firecrawl.dev",
  },
  {
    id: "exa",
    name: "Exa Neural Search",
    category: "ai",
    description: "Neural embeddings web search engine, semantic link filtering, similar URL search, and web knowledge extraction.",
    icon: Compass,
    accent: "#7c3aed",
    tags: ["Neural Search", "Embeddings Web", "Semantic Filtering", "Similar URLs"],
    docsUrl: "https://docs.exa.ai",
    connectUrl: "https://exa.ai",
  },
  {
    id: "langsmith",
    name: "LangSmith Observability",
    category: "ai",
    description: "Agent trajectory tracing, prompt evaluation benchmarks, execution step debugging, and token usage monitoring.",
    icon: Workflow,
    accent: "#1c3c3c",
    badge: "Agent Tracing",
    tags: ["Agent Traces", "Evaluation Benchmarks", "Prompt Debugging", "Token Monitoring"],
    docsUrl: "https://docs.smith.langchain.com",
    connectUrl: "https://smith.langchain.com",
  },
  {
    id: "openrouter",
    name: "OpenRouter Gateway",
    category: "ai",
    description: "Unified inference routing across 100+ open-weights and proprietary models with automatic fallback and failover.",
    icon: Cpu,
    accent: "#6366f1",
    badge: "Unified Gateway",
    tags: ["Model Router", "Auto Fallback", "Unified API", "Open Weights"],
    docsUrl: "https://openrouter.ai/docs",
    connectUrl: "https://openrouter.ai",
  },
  {
    id: "groq",
    name: "Groq LPU Inference",
    category: "ai",
    description: "Ultra-fast Language Processing Units (LPU), instantaneous token streaming, sub-second latency, and fast reasoning.",
    icon: Zap,
    accent: "#f55036",
    badge: "Ultra Fast",
    tags: ["LPU Inference", "Sub-second Streaming", "Low Latency", "High Throughput"],
    docsUrl: "https://console.groq.com/docs",
    connectUrl: "https://console.groq.com",
  },
  {
    id: "cerebras",
    name: "Cerebras Inference",
    category: "ai",
    description: "Wafer-scale AI inference, record-breaking token generation speeds, massive throughput, and large context windows.",
    icon: Cpu,
    accent: "#ff7849",
    badge: "Wafer Scale",
    tags: ["Wafer Scale Engine", "Peak Tokens/Sec", "High Concurrency", "Massive Bandwidth"],
    docsUrl: "https://inference-docs.cerebras.ai",
    connectUrl: "https://cloud.cerebras.ai",
  },
  {
    id: "mistralplatform",
    name: "Mistral Platform",
    category: "ai",
    description: "Enterprise open-weights models, Codestral code generation, function calling APIs, and low-latency JSON mode.",
    icon: Layers,
    accent: "#ff7000",
    badge: "Open Weights",
    tags: ["Codestral", "Function Calling", "JSON Mode", "Low Latency"],
    docsUrl: "https://docs.mistral.ai",
    connectUrl: "https://console.mistral.ai",
  },
  {
    id: "deepgram",
    name: "Deepgram Speech AI",
    category: "ai",
    description: "Real-time speech-to-text audio intelligence, Nova-2 models, speaker diarization, and multilingual voice recognition.",
    icon: Radio,
    accent: "#13ef93",
    tags: ["Speech-to-Text", "Nova-2", "Audio Intelligence", "Speaker Diarization"],
    docsUrl: "https://developers.deepgram.com",
    connectUrl: "https://console.deepgram.com",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs Voice Synthesis",
    category: "ai",
    description: "Hyper-realistic voice generation, emotional nuance tuning, voice cloning, and multi-speaker conversational audio.",
    icon: Radio,
    accent: "#000000",
    badge: "Voice AI",
    tags: ["Voice Synthesis", "Voice Cloning", "Emotional Nuance", "Multilingual Speech"],
    docsUrl: "https://elevenlabs.io/docs",
    connectUrl: "https://elevenlabs.io",
  },
  {
    id: "pipedrive",
    name: "Pipedrive Sales CRM",
    category: "productivity",
    description: "Visual sales pipeline management, deal stage progression, contact timeline synchronization, and activity reminders.",
    icon: TrendingUp,
    accent: "#00b862",
    tags: ["Sales Pipeline", "Deal Tracking", "Activity Reminders", "CRM Sync"],
    docsUrl: "https://pipedrive.readme.io",
    connectUrl: "https://app.pipedrive.com",
  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All Integrations" },
  { id: "productivity", label: "Workspace & Office" },
  { id: "developer", label: "Developer & Code" },
  { id: "cloud", label: "Cloud & Databases" },
  { id: "ai", label: "Web Search & Automation" },
  { id: "custom", label: "Custom Connections" },
];

function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("neura_connected_integrations");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      github: true,
      supabase: true,
      webgpu: true,
      websearch: true,
      googledrive: true,
    };
  });
  const [customIntegrations, setCustomIntegrations] = useState<Integration[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("neura_custom_integrations");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "",
    type: "REST API Webhook",
    connectUrl: "",
    description: "",
    authType: "Bearer Token / API Key",
  });
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState<"ts" | "python" | "curl">("ts");

  const allIntegrations = useMemo(() => {
    return [...customIntegrations, ...INTEGRATIONS];
  }, [customIntegrations]);

  const filtered = useMemo(() => {
    return allIntegrations.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "custom" ? !!item.isCustom : item.category === selectedCategory);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [allIntegrations, selectedCategory, searchQuery]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.name.trim() || !customForm.connectUrl.trim()) return;

    let targetUrl = customForm.connectUrl.trim();
    if (
      !targetUrl.startsWith("http://") &&
      !targetUrl.startsWith("https://") &&
      !targetUrl.startsWith("/")
    ) {
      targetUrl = "https://" + targetUrl;
    }

    const newIntegration: Integration = {
      id: `custom-${Date.now()}`,
      name: customForm.name.trim(),
      category: "custom",
      description:
        customForm.description.trim() ||
        `Custom integration with ${customForm.name.trim()} via ${customForm.type}.`,
      icon: customForm.type.includes("MCP") ? Workflow : Database,
      accent: "#a855f7",
      badge: "Custom",
      tags: [customForm.type, customForm.authType],
      popular: true,
      docsUrl: targetUrl,
      connectUrl: targetUrl,
      isCustom: true,
      authType: customForm.authType,
    };

    const updated = [newIntegration, ...customIntegrations];
    setCustomIntegrations(updated);
    try {
      localStorage.setItem("neura_custom_integrations", JSON.stringify(updated));
    } catch (err) {}

    // Open connection link immediately
    if (targetUrl.startsWith("http")) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    // Mark as connected
    setConnectedMap((prev) => {
      const next = { ...prev, [newIntegration.id]: true };
      try {
        localStorage.setItem("neura_connected_integrations", JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    setIsAddingCustom(false);
    setCustomForm({
      name: "",
      type: "REST API Webhook",
      connectUrl: "",
      description: "",
      authType: "Bearer Token / API Key",
    });
  };

  const handleDeleteCustom = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = customIntegrations.filter((c) => c.id !== id);
    setCustomIntegrations(updated);
    try {
      localStorage.setItem("neura_custom_integrations", JSON.stringify(updated));
    } catch (err) {}
    setConnectedMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      try {
        localStorage.setItem("neura_connected_integrations", JSON.stringify(copy));
      } catch (err) {}
      return copy;
    });
    if (selectedIntegration?.id === id) {
      setSelectedIntegration(null);
    }
  };

  const connectIntegration = (item: Integration, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (item.connectUrl) {
      if (item.connectUrl.startsWith("http")) {
        window.open(item.connectUrl, "_blank", "noopener,noreferrer");
      } else if (item.connectUrl.startsWith("/")) {
        window.location.href = item.connectUrl;
      }
    }
    setConnectedMap((prev) => {
      const next = { ...prev, [item.id]: true };
      try {
        localStorage.setItem("neura_connected_integrations", JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const disconnectIntegration = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setConnectedMap((prev) => {
      const next = { ...prev, [id]: false };
      try {
        localStorage.setItem("neura_connected_integrations", JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const snippets = {
    ts: `import { NeuraClient } from "@neura/sdk";

const neura = new NeuraClient({
  apiKey: process.env.NEURA_API_KEY,
  endpoint: "https://api.neura.ai/v1"
});

// Stream reasoning with GitHub & Linear integration
const stream = await neura.agent.stream({
  prompt: "Review PR #42 and summarize linked issues",
  integrations: ["github", "linear"],
  mode: "deep"
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}`,
    python: `from neura import NeuraClient
import os

client = NeuraClient(api_key=os.environ["NEURA_API_KEY"])

# Dispatch task with Supabase pgvector tool
response = client.agent.dispatch(
    prompt="Find semantic duplicates across user conversations",
    integrations=["supabase", "postgres"],
    timeout_ms=5000
)

print(response.output)`,
    curl: `curl -X POST https://api.neura.ai/v1/agent/dispatch \\
  -H "Authorization: Bearer $NEURA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Sync latest documentation to Notion",
    "integrations": ["notion", "github"],
    "mode": "balanced"
  }'`,
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 2D Atmospheric Background Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 h-[38rem] w-[38rem] rounded-full bg-violet-600/10 blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_12px_rgba(110,231,255,0.25)]">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#6ee7ff] animate-ping" />
              <span className="absolute h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.24em] text-white">
              NEURA
            </span>
            <span className="ml-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
              INTEGRATIONS
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Overview
            </Link>
            <Link
              to="/features"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Capabilities
            </Link>
            <Link
              to="/models"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Models
            </Link>
            <Link
              to="/integrations"
              className="text-xs font-semibold text-cyan-400"
            >
              Integrations
            </Link>
            <Link
              to="/pricing"
              className="text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.04] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/app"
              onClick={() => localStorage.setItem("neura_demo_session", "true")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(110,231,255,0.3)] transition-all hover:shadow-[0_0_25px_rgba(110,231,255,0.5)]"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Launch Assistant</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/30 px-3.5 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(110,231,255,0.15)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Connected Intelligence Ecosystem
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Connect Neura with your{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              entire stack
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base leading-relaxed text-white/70 md:text-lg"
          >
            Bridge Neura's multimodal reasoning with your version control, cloud
            infrastructure, IDEs, and databases. Instant bi-directional sync with zero friction.
          </motion.p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mt-14 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search integrations, tools, databases..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-white/30 focus:border-cyan-400/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(110,231,255,0.15)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Stats Counter & Custom Connection Button */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {Object.values(connectedMap).filter(Boolean).length} Active Connections
              </span>
              <span>•</span>
              <span>{filtered.length} Available Tools</span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="ml-auto flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(110,231,255,0.15)] transition-all hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(110,231,255,0.3)]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Custom Connection</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? "text-cyan-300"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {cat.label}
                  {active && (
                    <motion.div
                      layoutId="categoryActivePill"
                      className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/40 bg-cyan-950/40 shadow-[0_0_15px_rgba(110,231,255,0.15)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {/* Custom Connection Card Promo / Trigger */}
            {(selectedCategory === "all" || selectedCategory === "custom") && !searchQuery && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setIsAddingCustom(true)}
                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-dashed border-cyan-400/40 bg-gradient-to-b from-cyan-950/20 to-[#070b18]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-950/35 hover:shadow-[0_0_30px_rgba(110,231,255,0.2)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="rounded-md border border-cyan-400/30 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                      CUSTOM BUILDER
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-display text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      + Add Custom Connection
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      Connect your own REST API, MCP tool server, GraphQL endpoint, or proprietary webhook service.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {["Custom API", "MCP Server", "Webhook", "Bearer Auth"].map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <div className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-950/40 py-2 px-3 text-xs font-semibold text-cyan-300 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-white transition-all">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Configure Connection</span>
                  </div>
                </div>
              </motion.div>
            )}

            {filtered.map((item, index) => {
              const Icon = item.icon;
              const isConnected = !!connectedMap[item.id];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  onClick={() => setSelectedIntegration(item)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                    isConnected
                      ? "border-cyan-400/30 bg-gradient-to-b from-[#091024]/90 to-[#060a17]/90 shadow-[0_0_25px_rgba(110,231,255,0.08)] hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(110,231,255,0.18)]"
                      : "border-white/[0.08] bg-[#070b18]/70 hover:border-white/20 hover:bg-[#0a0f22]/90"
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-transform duration-300 group-hover:scale-105"
                        style={{ color: item.accent }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-white/70">
                            {item.badge}
                          </span>
                        )}
                        {item.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustom(item.id, e)}
                            title="Delete custom connection"
                            className="rounded-md border border-rose-500/30 bg-rose-500/10 p-1 text-rose-400 hover:bg-rose-500/20 hover:text-rose-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                        {isConnected && (
                          <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Connected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-4">
                      <h3 className="font-display text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/60 line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Tag Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-white/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="mt-6 border-t border-white/[0.06] pt-4">
                    {isConnected ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.connectUrl.startsWith("http")) {
                              window.open(item.connectUrl, "_blank", "noopener,noreferrer");
                            }
                          }}
                          title={`Open ${item.name} portal`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 py-2 px-3 text-xs font-semibold text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Connected</span>
                          <ExternalLink className="h-3 w-3 ml-1 opacity-60 hover:opacity-100" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => disconnectIntegration(item.id, e)}
                          title="Disconnect"
                          className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/50 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => connectIntegration(item, e)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-950/25 py-2 px-3 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:shadow-[0_0_15px_rgba(110,231,255,0.25)] transition-all"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>Connect Tool</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search Fallback */}
        {filtered.length === 0 && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <SlidersHorizontal className="mx-auto h-8 w-8 text-white/30" />
            <h3 className="mt-3 font-display text-base font-semibold text-white">
              No matching integrations found
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Try adjusting your search terms or view all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-4 py-2 text-xs text-cyan-300 hover:bg-cyan-500/10"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Developer API & Webhook SDK Quickstart Panel */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#090f20]/90 via-[#060a16]/80 to-[#04060f]/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/30 px-3 py-0.5 text-xs text-cyan-300">
                <Code2 className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  DEVELOPER PLATFORM
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                Build your own custom integrations
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Neura provides a high-throughput, type-safe API with native WebSockets and Server-Sent
                Events (SSE). Dispatch autonomous agent tasks, inject domain vectors, or register
                custom webhooks directly into your continuous deployment stack.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Sub-45ms latency endpoint dispatch</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>HMAC-SHA256 authenticated webhook triggers</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Full TypeScript, Python, and Go SDK support</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/app"
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-[0_0_20px_rgba(110,231,255,0.3)] hover:opacity-90"
                >
                  <Bot className="h-4 w-4" />
                  <span>Try in Assistant Workspace</span>
                </Link>
                <a
                  href="mailto:developers@neura.ai?subject=Integration%20Access"
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/80 hover:border-cyan-400/40 hover:bg-white/[0.04]"
                >
                  <span>Request Custom Tool</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="relative rounded-2xl border border-white/10 bg-[#030611] p-5">
              {/* Snippet Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex gap-2">
                  {(["ts", "python", "curl"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSnippetTab(tab)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
                        activeSnippetTab === tab
                          ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      {tab === "ts" ? "TypeScript" : tab === "python" ? "Python" : "cURL"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => copyCode(snippets[activeSnippetTab])}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/60 transition-colors hover:border-cyan-400/40 hover:text-white"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre */}
              <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-cyan-100/90">
                <code>{snippets[activeSnippetTab]}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Integration Detail Modal */}
      <AnimatePresence>
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIntegration(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#080d1e] p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(110,231,255,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
                    style={{ color: selectedIntegration.accent }}
                  >
                    <selectedIntegration.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-white">
                      {selectedIntegration.name}
                    </h2>
                    <span className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                      {selectedIntegration.category} Integration
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/70">
                {selectedIntegration.description}
              </p>

              <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Status</span>
                  <span
                    className={
                      connectedMap[selectedIntegration.id]
                        ? "text-emerald-400 font-semibold"
                        : "text-white/70"
                    }
                  >
                    {connectedMap[selectedIntegration.id]
                      ? "● Connected & Synchronized"
                      : "○ Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Sync Method</span>
                  <span className="font-mono text-white/80">Bidirectional Webhooks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Data Encryption</span>
                  <span className="font-mono text-emerald-300">TLS 1.3 / AES-256</span>
                </div>
              </div>

              {/* Supported Features */}
              <div className="mt-5">
                <h4 className="text-xs font-semibold text-white/80">Supported Capabilities</h4>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {selectedIntegration.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-cyan-400/20 bg-cyan-950/30 px-2.5 py-1 font-mono text-[11px] text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Official Connection Portal Box */}
              <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-white/80">Original Connection Portal:</span>
                  </div>
                  <a
                    href={selectedIntegration.connectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate max-w-full sm:max-w-[260px] font-mono text-[11px] text-cyan-300 hover:text-cyan-100 hover:underline flex items-center gap-1"
                  >
                    <span>{selectedIntegration.connectUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => connectIntegration(selectedIntegration)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(110,231,255,0.3)] hover:opacity-95 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>
                    {connectedMap[selectedIntegration.id]
                      ? "Open Connection Portal"
                      : "Open Connection & Authorize"}
                  </span>
                </button>
                {connectedMap[selectedIntegration.id] && (
                  <button
                    type="button"
                    onClick={() => disconnectIntegration(selectedIntegration.id)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                  >
                    Disconnect
                  </button>
                )}
                {selectedIntegration.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCustom(selectedIntegration.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                )}
                <Link
                  to="/app"
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-center text-white/80 hover:bg-white/[0.04]"
                >
                  Workspace
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Custom Connection Modal */}
      <AnimatePresence>
        {isAddingCustom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingCustom(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-400/30 bg-[#070b18] p-6 shadow-[0_0_50px_rgba(110,231,255,0.2)] md:p-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      Add Custom Connection
                    </h3>
                    <p className="text-xs text-white/60">
                      Register a custom API endpoint, MCP tool server, or internal service
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingCustom(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCustom} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Connection Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    placeholder="e.g., Internal Database API, Custom MCP Server"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Integration Type
                  </label>
                  <select
                    value={customForm.type}
                    onChange={(e) => setCustomForm({ ...customForm, type: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1428] px-3.5 py-2.5 text-xs text-white focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                  >
                    <option value="REST API Webhook">REST API Webhook</option>
                    <option value="MCP Tool Server">Model Context Protocol (MCP) Server</option>
                    <option value="GraphQL Gateway">GraphQL Gateway</option>
                    <option value="OAuth 2.0 Web Portal">OAuth 2.0 Web Portal</option>
                    <option value="Database Proxy">Direct Database Proxy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Official Connection / Endpoint URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={customForm.connectUrl}
                    onChange={(e) => setCustomForm({ ...customForm, connectUrl: e.target.value })}
                    placeholder="https://api.mycompany.com/webhook or https://service.internal"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                  />
                  <p className="mt-1 text-[11px] text-white/40">
                    This link will open automatically when you or Neura connect to this service.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Authentication Method
                  </label>
                  <select
                    value={customForm.authType}
                    onChange={(e) => setCustomForm({ ...customForm, authType: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1428] px-3.5 py-2.5 text-xs text-white focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                  >
                    <option value="Bearer Token / API Key">Bearer Token / Header API Key</option>
                    <option value="OAuth 2.0 PKCE">OAuth 2.0 / PKCE Flow</option>
                    <option value="HMAC Secret Signature">HMAC Secret Webhook Signature</option>
                    <option value="Mutual TLS / Certificate">Mutual TLS Client Certificate</option>
                    <option value="None / Public Webhook">None / Open Endpoint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={customForm.description}
                    onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                    placeholder="Describe how Neura should route context and trigger operations with this endpoint..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/70 hover:bg-white/[0.04] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(110,231,255,0.3)] hover:opacity-95 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create & Connect</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#03050c] pt-8 pb-28 text-center text-xs text-white/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p>© {new Date().getFullYear()} Neura Intelligence Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/app" className="hover:text-white transition-colors">
              Assistant Workspace
            </Link>
            <Link to="/auth" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
