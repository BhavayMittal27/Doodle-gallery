(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const d of i)if(d.type==="childList")for(const f of d.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function o(i){const d={};return i.integrity&&(d.integrity=i.integrity),i.referrerPolicy&&(d.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?d.credentials="include":i.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function s(i){if(i.ep)return;i.ep=!0;const d=o(i);fetch(i.href,d)}})();const F=[{id:"doodle-weather-app",title:"SkySketch: Weather UI Mockup",category:"portfolio",tag:"UI Wireframe",date:"May 2026",likes:42,author:"Bhavay",description:"A playful, hand-drawn wireframe mockup of a weather forecasting app. Shows layout planning for responsive widget placement, cartoonish weather condition drawings, and simple typography hierarchy. Designed during initial prototyping stages.",techTags:["Figma Sketch","Mobile Design","SVG Layouts","UI/UX Prototyping"],svg:`
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="svg-sketch-graphic">
      <!-- Phone Frame -->
      <rect x="130" y="15" width="140" height="270" rx="18" ry="18" stroke="currentColor" stroke-width="2.5" fill="none" />
      <line x1="180" y1="28" x2="220" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <circle cx="200" cy="275" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
      
      <!-- Screen Contents -->
      <!-- Search bar -->
      <rect x="145" y="45" width="110" height="15" rx="5" stroke="currentColor" stroke-width="1.5" fill="none" />
      <path d="M242 52.5 L247 57" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="241" cy="51" r="2.5" stroke="currentColor" stroke-width="1.5" fill="none" />
      
      <!-- Big Weather Icon (Smiling Sun & Cloud) -->
      <circle cx="185" cy="100" r="16" stroke="currentColor" stroke-width="2" fill="none" />
      <!-- Sun rays -->
      <path d="M185 75 L185 80 M185 120 L185 125 M160 100 L165 100 M205 100 L210 100 M168 83 L172 87 M198 113 L202 117 M168 117 L172 113 M198 83 L202 87" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Cloud overlapping sun -->
      <path d="M190 115 C185 105, 205 95, 215 102 C225 95, 235 105, 230 115 C235 122, 222 130, 210 125 C200 130, 185 125, 190 115 Z" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" stroke-linejoin="round" />
      
      <!-- Temperature -->
      <text x="200" y="160" font-family="var(--font-hand)" font-size="24" text-anchor="middle" fill="currentColor" font-weight="bold">24°C</text>
      <text x="200" y="176" font-family="var(--font-ui)" font-size="8" text-anchor="middle" fill="currentColor">Clear &amp; Cozy</text>
      
      <!-- Weekly Forecast Rows -->
      <!-- Mon -->
      <line x1="145" y1="195" x2="255" y2="195" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3" />
      <text x="145" y="208" font-family="var(--font-hand)" font-size="10" fill="currentColor">Mon</text>
      <circle cx="200" cy="205" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
      <text x="255" y="208" font-family="var(--font-ui)" font-size="9" text-anchor="end" fill="currentColor">26° / 18°</text>
      
      <!-- Tue -->
      <line x1="145" y1="215" x2="255" y2="215" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3" />
      <text x="145" y="228" font-family="var(--font-hand)" font-size="10" fill="currentColor">Tue</text>
      <!-- Cloud -->
      <path d="M195 228 C192 224, 200 220, 204 223 C208 221, 212 225, 210 228 Z" stroke="currentColor" stroke-width="1.2" fill="none" />
      <text x="255" y="228" font-family="var(--font-ui)" font-size="9" text-anchor="end" fill="currentColor">22° / 15°</text>
      
      <!-- Wed -->
      <line x1="145" y1="235" x2="255" y2="235" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3" />
      <text x="145" y="248" font-family="var(--font-hand)" font-size="10" fill="currentColor">Wed</text>
      <circle cx="200" cy="245" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
      <text x="255" y="248" font-family="var(--font-ui)" font-size="9" text-anchor="end" fill="currentColor">28° / 20°</text>
    </svg>
    `},{id:"doodle-dashboard",title:"SketchBoard: Analytics Wireframe",category:"portfolio",tag:"UI Wireframe",date:"April 2026",likes:58,author:"Bhavay",description:"An interactive layout wireframe sketching a system dashboard layout. Explores data grids, responsive panel splits, chart placeholders (bar and wave charts), and header search flows. Reflects an initial layout exploration for a React admin board.",techTags:["React.js","Chart Layouts","Responsive Design","Dashboard UX"],svg:`
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="svg-sketch-graphic">
      <!-- Browser Window -->
      <rect x="25" y="20" width="350" height="260" rx="10" ry="10" stroke="currentColor" stroke-width="2" fill="none" />
      <!-- Header bar -->
      <line x1="25" y1="45" x2="375" y2="45" stroke="currentColor" stroke-width="2" />
      <!-- Browser control dots -->
      <circle cx="40" cy="32" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="52" cy="32" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="64" cy="32" r="4" stroke="currentColor" stroke-width="1.5" fill="none" />
      <rect x="100" y="27" width="120" height="10" rx="3" stroke="currentColor" stroke-width="1.5" fill="none" />
      
      <!-- Layout: Sidebar -->
      <line x1="90" y1="45" x2="90" y2="280" stroke="currentColor" stroke-width="2" />
      <!-- Sidebar items -->
      <rect x="35" y="60" width="45" height="8" rx="2" stroke="currentColor" stroke-width="1" fill="none" />
      <rect x="35" y="75" width="45" height="8" rx="2" stroke="currentColor" stroke-width="1" fill="none" />
      <rect x="35" y="90" width="45" height="8" rx="2" stroke="currentColor" stroke-width="1" fill="none" />
      <rect x="35" y="105" width="45" height="8" rx="2" stroke="currentColor" stroke-width="1" fill="none" />
      
      <!-- Layout: Main Content Panels -->
      <!-- Card 1: Metric -->
      <rect x="105" y="60" width="75" height="40" rx="6" stroke="currentColor" stroke-width="1.5" fill="none" />
      <text x="112" y="75" font-family="var(--font-ui)" font-size="8" fill="currentColor">Sales</text>
      <text x="112" y="92" font-family="var(--font-hand)" font-size="14" fill="currentColor" font-weight="bold">$12.4k</text>
      
      <!-- Card 2: Metric -->
      <rect x="195" y="60" width="75" height="40" rx="6" stroke="currentColor" stroke-width="1.5" fill="none" />
      <text x="202" y="75" font-family="var(--font-ui)" font-size="8" fill="currentColor">Users</text>
      <text x="202" y="92" font-family="var(--font-hand)" font-size="14" fill="currentColor" font-weight="bold">+1,402</text>
      
      <!-- Card 3: Metric -->
      <rect x="285" y="60" width="80" height="40" rx="6" stroke="currentColor" stroke-width="1.5" fill="none" />
      <text x="292" y="75" font-family="var(--font-ui)" font-size="8" fill="currentColor">Growth</text>
      <path d="M292 90 Q305 80, 315 88 T335 75" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="335" cy="75" r="2" fill="currentColor" />
      
      <!-- Big Panel: Line Graph -->
      <rect x="105" y="115" width="165" height="95" rx="8" stroke="currentColor" stroke-width="2" fill="none" />
      <text x="115" y="132" font-family="var(--font-hand)" font-size="10" fill="currentColor" font-weight="bold">Performance History</text>
      <!-- Graph Lines -->
      <path d="M120 190 Q145 150, 165 170 T215 130 T255 160" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M120 190 L255 190" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" />
      <path d="M120 145 L255 145" stroke="currentColor" stroke-width="0.5" stroke-dasharray="1 4" />
      
      <!-- Card 4: Doughnut Chart -->
      <rect x="285" y="115" width="80" height="95" rx="8" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="325" cy="160" r="20" stroke="currentColor" stroke-width="3" stroke-dasharray="35 15 20 10" fill="none" />
      <circle cx="325" cy="160" r="12" stroke="currentColor" stroke-width="1" fill="none" />
      <text x="325" y="195" font-family="var(--font-ui)" font-size="7" text-anchor="middle" fill="currentColor">Traffic Shares</text>
      
      <!-- Bottom Table Grid -->
      <rect x="105" y="225" width="260" height="45" rx="6" stroke="currentColor" stroke-width="1.5" fill="none" />
      <!-- Table rows -->
      <line x1="115" y1="240" x2="355" y2="240" stroke="currentColor" stroke-width="1" />
      <line x1="115" y1="255" x2="355" y2="255" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
      <circle cx="120" cy="232" r="3" fill="currentColor" />
      <line x1="130" y1="232" x2="200" y2="232" stroke="currentColor" stroke-width="2" />
      <circle cx="120" cy="247" r="3" fill="currentColor" />
      <line x1="130" y1="247" x2="180" y2="247" stroke="currentColor" stroke-width="2" />
    </svg>
    `},{id:"doodle-database",title:"GraphDB: Schema Diagram",category:"portfolio",tag:"Architecture",date:"March 2026",likes:67,author:"Bhavay",description:"An architectural doodle of a database schema layout, showing microservice database synchronization. Depicts an API Gateway orchestrating sync states between a relational User Database, an Authorization server, and a Redis cluster.",techTags:["API Architecture","Redis Sync","Relational DB","Microservices"],svg:`
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="svg-sketch-graphic">
      <!-- Database cylinder 1 (SQL DB) -->
      <g transform="translate(60, 110)">
        <ellipse cx="40" cy="10" rx="30" ry="10" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" />
        <path d="M10 10 L10 50 A30 10 0 0 0 70 50 L70 10" stroke="currentColor" stroke-width="2.5" fill="none" />
        <path d="M10 23 A30 10 0 0 0 70 23" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2 2" />
        <path d="M10 36 A30 10 0 0 0 70 36" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2 2" />
        <text x="40" y="32" font-family="var(--font-hand)" font-size="10" text-anchor="middle" fill="currentColor" font-weight="bold">Users DB</text>
      </g>
      
      <!-- Database cylinder 2 (Auth Cache) -->
      <g transform="translate(260, 110)">
        <ellipse cx="40" cy="10" rx="30" ry="10" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" />
        <path d="M10 10 L10 50 A30 10 0 0 0 70 50 L70 10" stroke="currentColor" stroke-width="2.5" fill="none" />
        <path d="M10 23 A30 10 0 0 0 70 23" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2 2" />
        <path d="M10 36 A30 10 0 0 0 70 36" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2 2" />
        <text x="40" y="32" font-family="var(--font-hand)" font-size="9" text-anchor="middle" fill="currentColor" font-weight="bold">Redis Cache</text>
      </g>
      
      <!-- API Gateway Router box -->
      <rect x="150" y="30" width="100" height="40" rx="8" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" />
      <text x="200" y="54" font-family="var(--font-hand)" font-size="11" text-anchor="middle" fill="currentColor" font-weight="bold">GraphQL Gateway</text>
      
      <!-- Message Broker Cloud -->
      <path d="M165 240 C155 235, 145 245, 150 255 C140 260, 145 275, 160 270 C170 280, 190 280, 195 270 C205 275, 215 265, 210 255 C218 245, 200 232, 185 240 C175 230, 165 235, 165 240 Z" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <text x="180" y="260" font-family="var(--font-hand)" font-size="10" text-anchor="middle" fill="currentColor" font-weight="bold">Kafka PubSub</text>
      
      <!-- Connecting arrows with sketchy wobbliness -->
      <!-- Gateway -> SQL DB -->
      <path d="M170 73 C140 90, 120 100, 105 113" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <polygon points="102,108 102,117 110,114" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <text x="120" y="92" font-family="var(--font-ui)" font-size="8" fill="currentColor" transform="rotate(-20 120 92)">Read/Write</text>
      
      <!-- Gateway -> Cache -->
      <path d="M230 73 C260 90, 280 100, 295 113" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <polygon points="290,114 298,117 298,108" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <text x="272" y="92" font-family="var(--font-ui)" font-size="8" fill="currentColor" transform="rotate(20 272 92)">Sync Read</text>
      
      <!-- SQL DB -> Kafka -->
      <path d="M100 173 C110 205, 130 220, 150 236" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <polygon points="146,236 154,239 150,230" fill="currentColor" stroke="currentColor" stroke-width="1" />
      
      <!-- Kafka -> Cache Sync -->
      <path d="M210 242 C235 228, 275 210, 290 173" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <polygon points="286,174 292,168 294,177" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <text x="260" y="220" font-family="var(--font-ui)" font-size="8" fill="currentColor" transform="rotate(-15 260 220)">Invalidate Cache</text>
    </svg>
    `},{id:"doodle-workspace",title:"Coffee & Code Sketch",category:"portfolio",title:"Coffee & Code Workspace",tag:"Illustration",date:"March 2026",likes:84,author:"Bhavay",description:"A lovely artistic sketch expressing the programmer's core habitat: a steaming cup of coffee next to a laptop displaying interactive brackets, with loose stars and thoughts floating around. Emphasizes the creative vibe of programming.",techTags:["SVG Art","Creativity","Graphic Sketching"],svg:`
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="svg-sketch-graphic">
      <!-- Laptop -->
      <rect x="70" y="110" width="160" height="100" rx="6" ry="6" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" />
      <!-- Screen hinge lines -->
      <line x1="60" y1="210" x2="240" y2="210" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <path d="M60 210 L50 222 A10 5 0 0 0 65 225 L245 225 A10 5 0 0 0 250 222 L240 210" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" stroke-linejoin="round" />
      
      <!-- Code on Screen -->
      <text x="150" y="145" font-family="var(--font-hand)" font-size="20" text-anchor="middle" fill="var(--ink-primary)" font-weight="bold">&lt;code /&gt;</text>
      <!-- Sketchy lines of code -->
      <line x1="95" y1="170" x2="140" y2="170" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="95" y1="182" x2="175" y2="182" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="110" y1="194" x2="160" y2="194" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      
      <!-- Steaming Coffee Cup -->
      <g transform="translate(265, 140)">
        <!-- Cup Body -->
        <path d="M15 35 C15 65, 55 65, 55 35 Z" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" stroke-linejoin="round" />
        <!-- Cup Handle -->
        <path d="M55 40 C65 40, 68 50, 55 52" stroke="currentColor" stroke-width="2.2" fill="none" />
        <!-- Cup Rim -->
        <ellipse cx="35" cy="35" rx="20" ry="4" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
        
        <!-- Coffee Steam -->
        <path d="M25 22 Q20 15, 25 8 T20 0" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <path d="M35 25 Q32 17, 37 12 T32 3" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <path d="M45 22 Q40 15, 45 8 T40 0" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
        
        <!-- Saucer plate -->
        <ellipse cx="35" cy="62" rx="28" ry="5" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      </g>
      
      <!-- Floating Sparkles & Coffee Beans -->
      <text x="320" y="80" font-family="var(--font-hand)" font-size="26" fill="var(--ink-highlight)" transform="rotate(20 320 80)">★</text>
      <text x="50" y="80" font-family="var(--font-hand)" font-size="20" fill="var(--ink-highlight)" transform="rotate(-15 50 80)">★</text>
      <!-- Sparkle sparks -->
      <path d="M220 70 L220 76 M217 73 L223 73" stroke="currentColor" stroke-width="1.2" />
      <path d="M315 210 L315 216 M312 213 L318 213" stroke="currentColor" stroke-width="1.2" />
      <!-- Coffee bean sketch -->
      <ellipse cx="280" cy="225" rx="5" ry="3" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(35 280 225)" />
      <path d="M276 226 Q280 224, 284 222" stroke="currentColor" stroke-width="1" fill="none" transform="rotate(35 280 225)" />
    </svg>
    `},{id:"doodle-neural-net",title:"Neuromorphic AI Concept",category:"portfolio",tag:"Architecture",date:"February 2026",likes:91,author:"Bhavay",description:"A conceptual computer engineering drawing of a neural network map, shaped like a glowing human brain. Explores how deep learning models map inputs to hidden layers, and features an integrated glowing feedback loop.",techTags:["Deep Learning","TensorFlow","Neural Mapping","AI Concepts"],svg:`
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="svg-sketch-graphic">
      <!-- Neural brain outline -->
      <path d="M200 45 C150 45, 110 70, 110 110 C110 130, 120 145, 130 155 C120 170, 125 195, 145 200 C155 215, 175 220, 190 220 L200 220 L210 220 C225 220, 245 215, 255 200 C275 195, 280 170, 270 155 C280 145, 290 130, 290 110 C290 70, 250 45, 200 45 Z" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" fill="none" />
      
      <!-- Nodes / Neurons -->
      <!-- Input nodes (left) -->
      <circle cx="150" cy="90" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <circle cx="140" cy="120" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <circle cx="155" cy="155" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      
      <!-- Hidden layer nodes (middle) -->
      <circle cx="200" cy="80" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <circle cx="195" cy="115" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <circle cx="205" cy="150" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <circle cx="190" cy="180" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      
      <!-- Output nodes (right) -->
      <circle cx="250" cy="100" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      <circle cx="245" cy="140" r="6" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      
      <!-- Connections / Weights -->
      <!-- Input to Hidden -->
      <line x1="156" y1="90" x2="194" y2="81" stroke="currentColor" stroke-width="1" />
      <line x1="156" y1="90" x2="189" y2="114" stroke="currentColor" stroke-width="1.5" />
      <line x1="146" y1="120" x2="189" y2="116" stroke="currentColor" stroke-width="1" />
      <line x1="146" y1="120" x2="199" y2="146" stroke="currentColor" stroke-width="2" />
      <line x1="161" y1="155" x2="199" y2="151" stroke="currentColor" stroke-width="1" />
      <line x1="161" y1="155" x2="185" y2="176" stroke="currentColor" stroke-width="1.5" />
      <line x1="146" y1="120" x2="194" y2="81" stroke="currentColor" stroke-width="0.75" />
      
      <!-- Hidden to Output -->
      <line x1="206" y1="80" x2="244" y2="97" stroke="currentColor" stroke-width="1.8" />
      <line x1="201" y1="115" x2="244" y2="102" stroke="currentColor" stroke-width="1" />
      <line x1="201" y1="115" x2="239" y2="138" stroke="currentColor" stroke-width="1.5" />
      <line x1="211" y1="150" x2="239" y2="141" stroke="currentColor" stroke-width="2" />
      <line x1="196" y1="180" x2="239" y2="143" stroke="currentColor" stroke-width="1.2" />
      
      <!-- Glowing active weights (highlighted lines) -->
      <path d="M140 120 L195 115 L245 140" stroke="var(--ink-primary)" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M150 90 L200 80 L250 100" stroke="var(--ink-secondary)" stroke-width="2" fill="none" stroke-linecap="round" />
      
      <!-- Glowing bursts inside neurons -->
      <circle cx="195" cy="115" r="2" fill="var(--ink-primary)" />
      <circle cx="200" cy="80" r="2" fill="var(--ink-secondary)" />
      
      <!-- Brain stem nodes -->
      <path d="M190 220 Q195 240, 192 260 M210 220 Q205 242, 208 260" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M192 250 L208 250" stroke="currentColor" stroke-width="1.5" />
      
      <!-- Text label -->
      <text x="200" y="285" font-family="var(--font-hand)" font-size="11" text-anchor="middle" fill="currentColor">Hidden Layers Activating...</text>
    </svg>
    `},{id:"doodle-retro-game",title:"Retro Console Game Loop",category:"portfolio",tag:"Illustration",date:"January 2026",likes:72,author:"Bhavay",description:"A fun sketch of a classic handheld gaming console, showcasing layout plans for grid-based game loops. Features screen drawings of a cute adventurer climbing platforms, collecting a coin, and avoiding a spike monster.",techTags:["Game Loops","Canvas API","Retro Design","Sprite Math"],svg:`
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="svg-sketch-graphic">
      <!-- Gameboy Shell -->
      <rect x="120" y="15" width="160" height="270" rx="15" ry="15" stroke="currentColor" stroke-width="3" fill="var(--bg-canvas)" />
      <!-- Battery Indicator LED -->
      <circle cx="138" cy="80" r="3" fill="var(--ink-primary)" stroke="currentColor" stroke-width="1" />
      
      <!-- Screen Border -->
      <rect x="145" y="30" width="110" height="85" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
      
      <!-- Game Screen Details -->
      <g transform="translate(150, 35)">
        <rect x="0" y="0" width="100" height="75" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2 2" />
        
        <!-- Game Platform 1 -->
        <line x1="5" y1="60" x2="55" y2="60" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <!-- Platform 2 -->
        <line x1="45" y1="40" x2="95" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        
        <!-- Player Sprite (cute block with eyes & legs) -->
        <rect x="20" y="46" width="10" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="var(--bg-canvas)" />
        <circle cx="23" cy="52" r="1" fill="currentColor" />
        <circle cx="27" cy="52" r="1" fill="currentColor" />
        <path d="M22 56 Q25 58, 28 56" stroke="currentColor" stroke-width="1" fill="none" />
        
        <!-- Coin (glowing) -->
        <circle cx="75" cy="28" r="4" stroke="currentColor" stroke-width="1.2" fill="var(--ink-highlight)" />
        <text x="75" y="31" font-family="var(--font-ui)" font-size="6" text-anchor="middle" fill="var(--ink-dark)" font-weight="bold">$</text>
        
        <!-- Spike Monster -->
        <path d="M70 60 L74 54 L78 60 L82 54 L86 60" stroke="currentColor" stroke-width="1.5" fill="none" />
        
        <!-- Game Stats HUD -->
        <text x="5" y="10" font-family="var(--font-ui)" font-size="7" fill="currentColor">SCORE: 01420</text>
        <text x="95" y="10" font-family="var(--font-ui)" font-size="7" text-anchor="end" fill="currentColor">♥ ♥ ♥</text>
      </g>
      
      <!-- Console Controls -->
      <!-- D-Pad -->
      <g transform="translate(145, 150)">
        <rect x="12" y="0" width="12" height="36" rx="2" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
        <rect x="0" y="12" width="36" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
        <circle cx="18" cy="18" r="3" fill="currentColor" />
      </g>
      
      <!-- Action Buttons A / B -->
      <g transform="translate(225, 160)">
        <circle cx="12" cy="18" r="10" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
        <text x="12" y="21" font-family="var(--font-ui)" font-size="8" text-anchor="middle" fill="currentColor" font-weight="bold">B</text>
        
        <circle cx="34" cy="8" r="10" stroke="currentColor" stroke-width="2" fill="var(--bg-canvas)" />
        <text x="34" y="11" font-family="var(--font-ui)" font-size="8" text-anchor="middle" fill="currentColor" font-weight="bold">A</text>
      </g>
      
      <!-- Select / Start Buttons -->
      <g transform="translate(170, 220)">
        <rect x="0" y="5" width="20" height="6" rx="2" stroke="currentColor" stroke-width="1.5" fill="var(--bg-canvas)" transform="rotate(-25)" />
        <rect x="30" y="5" width="20" height="6" rx="2" stroke="currentColor" stroke-width="1.5" fill="var(--bg-canvas)" transform="rotate(-25)" />
        <text x="2" y="22" font-family="var(--font-ui)" font-size="6" fill="currentColor">SELECT</text>
        <text x="32" y="22" font-family="var(--font-ui)" font-size="6" fill="currentColor">START</text>
      </g>
      
      <!-- Speaker grill slits -->
      <line x1="230" y1="250" x2="245" y2="235" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="236" y1="250" x2="251" y2="235" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="242" y1="250" x2="257" y2="235" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="248" y1="250" x2="263" y2="235" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    `}],N={name:"Bhavay",title:"Creative Full-Stack Developer & UX Architect",bio:"Hi! I'm Bhavay, a developer who builds high-performance, modern web applications. I bridge the gap between creative visual designs and solid database structures. I love experimenting with HTML5 Canvas, SVG rendering, animations, and clean state systems. When I'm not coding, I'm sketching UI diagrams, wireframes, and playful graphics.",facts:["🚀 3+ Years of building responsive web applications.","🎨 Passionate about interaction design, graphics, and animations.","💻 Master of JavaScript, CSS variables, HTML5 Canvas, and modern web frameworks.","☕ Fueled by quality coffee, modular code, and elegant CSS hacks."],avatarSvg:`
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- Sketchy avatar avatar outline -->
    <circle cx="100" cy="80" r="40" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" />
    <!-- Glasses -->
    <rect x="78" y="72" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none" />
    <rect x="104" y="72" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none" />
    <line x1="96" y1="78" x2="104" y2="78" stroke="currentColor" stroke-width="2" />
    <line x1="70" y1="76" x2="78" y2="76" stroke="currentColor" stroke-width="1.5" />
    <line x1="122" y1="76" x2="130" y2="76" stroke="currentColor" stroke-width="1.5" />
    
    <!-- Smile -->
    <path d="M92 95 Q100 102, 108 95" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
    
    <!-- Hair (wild sketch lines) -->
    <path d="M60 70 Q75 35, 100 40 T140 70 Q130 50, 110 50 T75 52 Z" stroke="currentColor" stroke-width="2.5" fill="currentColor" />
    
    <!-- Headphones -->
    <path d="M55 80 A45 45 0 0 1 145 80" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
    <rect x="52" y="72" width="8" height="20" rx="3" stroke="currentColor" stroke-width="2.5" fill="currentColor" />
    <rect x="140" y="72" width="8" height="20" rx="3" stroke="currentColor" stroke-width="2.5" fill="currentColor" />
    
    <!-- Body / Shoulders -->
    <path d="M40 170 C40 135, 60 130, 80 135 L120 135 C140 130, 160 135, 160 170 Z" stroke="currentColor" stroke-width="2.5" fill="var(--bg-canvas)" stroke-linejoin="round" />
    <!-- Collar -->
    <path d="M85 136 L100 150 L115 136" stroke="currentColor" stroke-width="2" fill="none" />
    
    <!-- Little Floating Code Symbol -->
    <text x="160" y="65" font-family="var(--font-hand)" font-size="18" fill="var(--ink-primary)" transform="rotate(15 160 65)">&lt;/&gt;</text>
  </svg>
  `},W={frontend:[{name:"JavaScript (ES6+)",value:92},{name:"HTML5 Canvas & SVGs",value:88},{name:"React.js / Next.js",value:85},{name:"CSS3 & Custom Animations",value:95}],backend:[{name:"Node.js & Express",value:80},{name:"SQL & NoSQL Databases",value:75},{name:"REST / GraphQL APIs",value:84},{name:"Git & Web Performance",value:82}]},q=[{time:"2024 - Present",role:"Senior Full-Stack Architect",company:"CreativeCode Studios",desc:"Spearheaded interactive graphics initiatives. Built high-traffic single page apps utilizing HTML5 Canvas dashboards, cutting asset load-times by 40%. Managed teams of 4 developers."},{time:"2022 - 2024",role:"Web Application Developer",company:"PixelPerfect Solutions",desc:"Crafted modular frontend components for large-scale SaaS applications using React and Next.js. Engineered interactive mockups and custom SVG filters for custom branding campaigns."},{time:"2021 - 2022",role:"Junior UI Engineer",company:"Scribble Web Labs",desc:"Worked closely with design agencies to translate wireframes and doodles into responsive HTML/CSS structures. Optimized web layout layouts for fluid touch devices."}];window.PORTFOLIO_DOODLES=F;window.RESUME_PROFILE=N;window.RESUME_SKILLS=W;window.RESUME_EXPERIENCE=q;let Q=class{constructor(n,o=!1){this.canvas=document.getElementById(n),this.canvas&&(this.ctx=this.canvas.getContext("2d"),this.isMini=o,this.isDrawing=!1,this.startX=0,this.startY=0,this.currentTool="brush",this.currentShape="free",this.currentColor="#2b2b2b",this.brushSize=6,this.brushOpacity=1,this.history=[],this.historyIndex=-1,this.maxHistory=25,this.previewSnapshot=null,this.init())}init(){this.resizeCanvas(),this.setupListeners(),this.isMini||this.saveHistoryState()}resizeCanvas(){let n=null,o=null;this.canvas.width>0&&this.canvas.height>0&&(n=document.createElement("canvas"),n.width=this.canvas.width,n.height=this.canvas.height,o=n.getContext("2d"),o.drawImage(this.canvas,0,0));const s=this.canvas.parentElement.getBoundingClientRect(),i=window.devicePixelRatio||1;this.canvas.width=s.width*i,this.canvas.height=(this.isMini?220:500)*i,this.ctx.scale(i,i),this.canvas.style.width="100%",this.canvas.style.height=this.isMini?"220px":"500px",this.ctx.lineCap="round",this.ctx.lineJoin="round",n&&o&&this.ctx.drawImage(n,0,0,n.width/i,n.height/i)}setupListeners(){this.canvas.addEventListener("mousedown",o=>this.startDrawing(o)),this.canvas.addEventListener("mousemove",o=>this.draw(o)),this.canvas.addEventListener("mouseup",()=>this.stopDrawing()),this.canvas.addEventListener("mouseleave",()=>this.stopDrawing()),this.canvas.addEventListener("touchstart",o=>{o.preventDefault();const s=o.touches[0];this.startDrawing(s)}),this.canvas.addEventListener("touchmove",o=>{o.preventDefault();const s=o.touches[0];this.draw(s)},{passive:!1}),this.canvas.addEventListener("touchend",()=>this.stopDrawing());let n;window.addEventListener("resize",()=>{clearTimeout(n),n=setTimeout(()=>this.resizeCanvas(),100)})}getMousePos(n){const o=this.canvas.getBoundingClientRect();return{x:n.clientX-o.left,y:n.clientY-o.top}}startDrawing(n){this.isDrawing=!0;const o=this.getMousePos(n);this.startX=o.x,this.startY=o.y,this.ctx.lineWidth=this.brushSize,this.ctx.strokeStyle=this.currentColor,this.ctx.globalAlpha=this.brushOpacity,this.currentTool==="eraser"?(this.ctx.globalCompositeOperation="destination-out",this.ctx.strokeStyle="rgba(0,0,0,1)",this.ctx.lineWidth=this.brushSize*1.5):this.currentTool==="highlighter"?(this.ctx.globalCompositeOperation="source-over",this.ctx.globalAlpha=.35):this.ctx.globalCompositeOperation="source-over",this.currentShape!=="free"?this.previewSnapshot=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height):(this.ctx.beginPath(),this.ctx.moveTo(this.startX,this.startY),this.ctx.lineTo(this.startX+.1,this.startY),this.ctx.stroke())}draw(n){if(!this.isDrawing)return;const o=this.getMousePos(n);if(this.currentShape==="free")this.ctx.lineTo(o.x,o.y),this.ctx.stroke();else if(this.previewSnapshot&&this.ctx.putImageData(this.previewSnapshot,0,0),this.ctx.beginPath(),this.currentShape==="line")this.ctx.moveTo(this.startX,this.startY),this.ctx.lineTo(o.x,o.y),this.ctx.stroke();else if(this.currentShape==="rect"){const s=o.x-this.startX,i=o.y-this.startY;this.ctx.strokeRect(this.startX,this.startY,s,i)}else if(this.currentShape==="circle"){const s=Math.sqrt(Math.pow(o.x-this.startX,2)+Math.pow(o.y-this.startY,2));this.ctx.arc(this.startX,this.startY,s,0,2*Math.PI),this.ctx.stroke()}}stopDrawing(){this.isDrawing&&(this.isDrawing=!1,this.ctx.closePath(),this.isMini||this.saveHistoryState())}saveHistoryState(){this.historyIndex<this.history.length-1&&(this.history=this.history.slice(0,this.historyIndex+1));const n=this.canvas.toDataURL();this.history.push(n),this.history.length>this.maxHistory?this.history.shift():this.historyIndex++,this.updateUndoRedoButtons()}undo(){this.historyIndex>0&&(this.historyIndex--,this.restoreHistoryState())}redo(){this.historyIndex<this.history.length-1&&(this.historyIndex++,this.restoreHistoryState())}restoreHistoryState(){const n=window.devicePixelRatio||1,o=new Image;o.src=this.history[this.historyIndex],o.onload=()=>{this.ctx.clearRect(0,0,this.canvas.width/n,this.canvas.height/n),this.ctx.drawImage(o,0,0,this.canvas.width/n,this.canvas.height/n),this.updateUndoRedoButtons()}}updateUndoRedoButtons(){const n=document.getElementById("undo-btn"),o=document.getElementById("redo-btn");n&&(n.disabled=this.historyIndex<=0),o&&(o.disabled=this.historyIndex>=this.history.length-1)}clear(){const n=window.devicePixelRatio||1;this.ctx.clearRect(0,0,this.canvas.width/n,this.canvas.height/n),this.isMini||(this.history=[],this.historyIndex=-1,this.saveHistoryState())}getMergedDataURL(n){const o=window.devicePixelRatio||1,s=document.createElement("canvas");s.width=this.canvas.width,s.height=this.canvas.height;const i=s.getContext("2d");if(n){i.fillStyle="#1b221f",i.fillRect(0,0,s.width,s.height),i.fillStyle="rgba(255, 255, 255, 0.02)";for(let d=0;d<s.width;d+=16*o)i.fillRect(d,0,1*o,s.height);for(let d=0;d<s.height;d+=16*o)i.fillRect(0,d,s.width,1*o)}else{i.fillStyle="#fcfbfa",i.fillRect(0,0,s.width,s.height),i.strokeStyle="rgba(186, 218, 255, 0.25)",i.lineWidth=1.5*o;const d=24*o;i.beginPath();for(let f=d;f<s.width;f+=d)i.moveTo(f,0),i.lineTo(f,s.height);for(let f=d;f<s.height;f+=d)i.moveTo(0,f),i.lineTo(s.width,f);i.stroke()}return i.drawImage(this.canvas,0,0),s.toDataURL("image/png")}};window.SketchCanvas=Q;document.addEventListener("DOMContentLoaded",()=>{let m=[...PORTFOLIO_DOODLES],n="all",o="paper";const s=new SketchCanvas("paint-canvas"),i=new SketchCanvas("hero-mini-canvas",!0),d={paper:[{name:"Graphite",hex:"#2b2b2b"},{name:"Rose Pen",hex:"#ec407a"},{name:"Blue Pen",hex:"#29b6f6"},{name:"Purple Marker",hex:"#ab47bc"},{name:"Green Highlighter",hex:"#9ccc65"},{name:"Red Pen",hex:"#ef5350"}],chalkboard:[{name:"White Chalk",hex:"#f5f6f5"},{name:"Pink Chalk",hex:"#ff8da1"},{name:"Blue Chalk",hex:"#8dcbff"},{name:"Purple Chalk",hex:"#e1b1ff"},{name:"Green Chalk",hex:"#b9f6ca"},{name:"Red Chalk",hex:"#ff8a80"}]};f();function f(){E(),I(),C(),B(),v(),T(),D(),$(),H()}function E(){const t=document.getElementById("theme-toggle"),r=t.querySelector(".sun-icon"),a=t.querySelector(".moon-icon");document.body.className="theme-paper",t.addEventListener("click",()=>{o==="paper"?(o="chalkboard",document.body.className="theme-chalkboard",r.style.display="none",a.style.display="block",y("Switched to Chalkboard (Dark Mode)","info")):(o="paper",document.body.className="theme-paper",r.style.display="block",a.style.display="none",y("Switched to Sketchbook (Light Mode)","info")),C(),M()})}function M(){const t=d[o];s.currentColor=t[0].hex,i.currentColor=t[0].hex;const r=document.getElementById("custom-color");r&&(r.value=t[0].hex);const a=document.getElementById("color-palette"),e=a.querySelector(".color-bubble");e&&(a.querySelectorAll(".color-bubble").forEach(l=>l.classList.remove("active")),e.classList.add("active"))}function I(){const t=document.querySelectorAll(".nav-link"),r=document.querySelectorAll(".page-section"),a={root:null,threshold:.3,rootMargin:"-80px 0px 0px 0px"},e=new IntersectionObserver(l=>{l.forEach(u=>{if(u.isIntersecting){const c=u.target.getAttribute("id");t.forEach(h=>{h.classList.remove("active"),h.getAttribute("href")===`#${c}`&&h.classList.add("active")})}})},a);r.forEach(l=>e.observe(l))}function C(){const t=document.getElementById("color-palette");if(!t)return;t.innerHTML="";const r=d[o];r.forEach((e,l)=>{const u=document.createElement("button");u.className=`color-bubble ${l===0?"active":""}`,u.style.backgroundColor=e.hex,u.title=e.name,u.setAttribute("aria-label",e.name),u.addEventListener("click",()=>{t.querySelectorAll(".color-bubble").forEach(h=>h.classList.remove("active")),u.classList.add("active"),s.currentColor=e.hex;const c=document.getElementById("custom-color");c&&(c.value=e.hex)}),t.appendChild(u)});const a=document.getElementById("custom-color");a&&(a.value=r[0].hex,a.addEventListener("input",e=>{t.querySelectorAll(".color-bubble").forEach(l=>l.classList.remove("active")),s.currentColor=e.target.value}))}function B(){const t=document.getElementById("brush-size"),r=document.getElementById("brush-size-val");t.addEventListener("input",c=>{const h=c.target.value;s.brushSize=h,r.textContent=`${h}px`});const a=document.getElementById("brush-opacity"),e=document.getElementById("brush-opacity-val");a.addEventListener("input",c=>{const h=c.target.value/100;s.brushOpacity=h,e.textContent=`${c.target.value}%`});const l=document.querySelectorAll(".tool-btn");l.forEach(c=>{c.addEventListener("click",()=>{l.forEach(h=>h.classList.remove("active")),c.classList.add("active"),s.currentTool=c.dataset.tool})});const u=document.querySelectorAll(".shape-btn");u.forEach(c=>{c.addEventListener("click",()=>{u.forEach(h=>h.classList.remove("active")),c.classList.add("active"),s.currentShape=c.dataset.shape})}),document.getElementById("undo-btn").addEventListener("click",()=>s.undo()),document.getElementById("redo-btn").addEventListener("click",()=>s.redo()),document.getElementById("clear-btn").addEventListener("click",()=>{s.clear(),y("Canvas cleared!","info")}),document.getElementById("clear-hero-canvas").addEventListener("click",()=>{i.clear(),y("Scratchpad cleared!","info")}),document.getElementById("download-btn").addEventListener("click",()=>{const c=o==="chalkboard",h=s.getMergedDataURL(c),g=document.createElement("a");g.download=`doodle_${Date.now()}.png`,g.href=h,g.click(),y("PNG Downloaded!","success")}),document.getElementById("save-gallery-btn").addEventListener("click",()=>{const c=document.getElementById("doodle-title"),h=c.value.trim()||"Untitled Doodle",g=o==="chalkboard",k=s.getMergedDataURL(g),p={id:`user-doodle-${Date.now()}`,title:h,category:"user",tag:"Guest Sketch",date:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}),likes:0,author:"Guest Designer",description:"A custom, interactive drawing painted live on the canvas within the Sketch Studio. Saved in local session memory.",techTags:["Canvas API","Mouse/Touch","Session Saved"],imageSrc:k};m.unshift(p),v(),c.value="",s.clear(),y(`Successfully posted "${h}" to the gallery!`,"success"),document.getElementById("gallery").scrollIntoView({behavior:"smooth"})})}function v(){const t=document.getElementById("gallery-grid");if(!t)return;t.innerHTML="";const r=document.getElementById("gallery-search").value.toLowerCase().trim(),a=m.filter(e=>{const l=n==="all"||e.category===n,u=e.title.toLowerCase().includes(r)||e.description.toLowerCase().includes(r)||e.techTags.some(c=>c.toLowerCase().includes(r));return l&&u});if(a.length===0){t.innerHTML=`
        <div class="no-results text-center hand-drawn" style="grid-column: 1/-1; padding: 3rem; font-size: 1.2rem; color: var(--text-muted);">
          No doodles found matching your criteria. Draw one in the Studio! ✎
        </div>
      `;return}a.forEach(e=>{const l=document.createElement("div");l.className="gallery-card sketch-border";let u="";e.svg?u=e.svg:e.imageSrc&&(u=`<img src="${e.imageSrc}" alt="${e.title}" loading="lazy">`),l.innerHTML=`
        <div class="card-media">
          <span class="card-tag">${e.tag}</span>
          ${u}
        </div>
        <div class="card-details">
          <h4 class="card-title hand-drawn">${e.title}</h4>
          <div class="card-meta">By ${e.author} &bull; ${e.date}</div>
          <p class="card-desc">${e.description}</p>
          <div class="card-footer">
            <div class="card-likes">
              <span>♥</span> <span class="likes-number">${e.likes}</span>
            </div>
            <button class="sketch-btn secondary-btn icon-btn card-like-btn" style="width:32px; height:32px; font-size: 0.75rem;" title="Like this doodle">♥</button>
          </div>
        </div>
      `,l.addEventListener("click",c=>{if(c.target.classList.contains("card-like-btn")){c.stopPropagation(),b(e.id,l.querySelector(".likes-number"));return}R(e)}),t.appendChild(l)})}function T(){const t=document.querySelectorAll(".filter-btn");t.forEach(r=>{r.addEventListener("click",()=>{t.forEach(a=>a.classList.remove("active")),r.classList.add("active"),n=r.dataset.filter,v()})}),document.getElementById("gallery-search").addEventListener("input",()=>{v()})}function b(t,r){const a=m.find(e=>e.id===t);if(a&&(a.likes++,r.textContent=a.likes,y(`Liked "${a.title}"!`,"success"),document.getElementById("doodle-lightbox").classList.contains("active"))){const l=document.getElementById("like-count");l&&(l.textContent=a.likes)}}function R(t){const r=document.getElementById("doodle-lightbox"),a=document.getElementById("lightbox-media-container"),e=document.getElementById("lightbox-tag"),l=document.getElementById("lightbox-title"),u=document.getElementById("lightbox-author"),c=document.getElementById("lightbox-date"),h=document.getElementById("lightbox-description"),g=document.getElementById("lightbox-tech-tags"),k=document.getElementById("lightbox-download"),p=document.getElementById("lightbox-like"),O=document.getElementById("like-count");if(a.innerHTML="",t.svg){a.innerHTML=t.svg;const x=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"});k.href=URL.createObjectURL(x),k.download=`${t.id}.svg`}else t.imageSrc&&(a.innerHTML=`<img src="${t.imageSrc}" alt="${t.title}">`,k.href=t.imageSrc,k.download=`${t.title.replace(/\s+/g,"_")}.png`);e.textContent=t.tag,l.textContent=t.title,u.textContent=t.author,c.textContent=t.date,h.textContent=t.description,O.textContent=t.likes,g.innerHTML="",t.techTags.forEach(x=>{const w=document.createElement("span");w.className="tech-tag hand-drawn",w.textContent=x,g.appendChild(w)});const S=p.cloneNode(!0);p.parentNode.replaceChild(S,p),S.addEventListener("click",()=>{document.querySelector(".gallery-card");const x=document.getElementById("like-count");b(t.id,x),v()}),r.classList.add("active");const U=document.getElementById("close-lightbox-btn"),G=document.getElementById("lightbox-close-overlay"),L=()=>{r.classList.remove("active")};U.onclick=L,G.onclick=L}function D(){const t=document.querySelectorAll(".resume-tab"),r=document.getElementById("resume-tab-content"),a=e=>{r.style.opacity="0",setTimeout(()=>{e==="profile"?P():e==="skills"?A():e==="experience"&&z(),r.style.opacity="1"},150)};t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(l=>l.classList.remove("active")),e.classList.add("active"),a(e.dataset.tab)})}),a("profile")}function P(){const t=document.getElementById("resume-tab-content");t.innerHTML=`
      <div class="profile-grid">
        <div class="profile-avatar-box sketch-border">
          ${RESUME_PROFILE.avatarSvg}
        </div>
        <div class="profile-details">
          <h3 class="hand-drawn">${RESUME_PROFILE.name}</h3>
          <div class="profile-title hand-drawn">${RESUME_PROFILE.title}</div>
          <p class="profile-bio">${RESUME_PROFILE.bio}</p>
          <ul class="profile-quick-facts">
            ${RESUME_PROFILE.facts.map(r=>`
              <li>
                <span class="bullet">☞</span>
                <span class="fact-text">${r}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `}function A(){const t=document.getElementById("resume-tab-content");t.innerHTML=`
      <div class="skills-grid">
        <!-- Frontend Column -->
        <div class="skills-column">
          <h3 class="hand-drawn">Frontend Sketchpad</h3>
          ${RESUME_SKILLS.frontend.map(r=>`
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${r.name}</span>
                <span class="skill-percentage hand-drawn">${r.value}%</span>
              </div>
              <div class="skill-bar-outer">
                <div class="skill-bar-inner" data-value="${r.value}"></div>
              </div>
            </div>
          `).join("")}
        </div>
        
        <!-- Backend Column -->
        <div class="skills-column">
          <h3 class="hand-drawn">Backend &amp; Logic</h3>
          ${RESUME_SKILLS.backend.map(r=>`
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${r.name}</span>
                <span class="skill-percentage hand-drawn">${r.value}%</span>
              </div>
              <div class="skill-bar-outer">
                <div class="skill-bar-inner" data-value="${r.value}"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,setTimeout(()=>{t.querySelectorAll(".skill-bar-inner").forEach(r=>{const a=r.getAttribute("data-value");r.style.width=`${a}%`})},50)}function z(){const t=document.getElementById("resume-tab-content");t.innerHTML=`
      <div class="timeline-container">
        <div class="timeline-line"></div>
        ${RESUME_EXPERIENCE.map(r=>`
          <div class="timeline-node">
            <div class="timeline-bullet"></div>
            <div class="timeline-time">${r.time}</div>
            <div class="timeline-content">
              <h4 class="timeline-role">${r.role}</h4>
              <div class="timeline-company hand-drawn">${r.company}</div>
              <p class="timeline-desc">${r.desc}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `}function $(){const t=document.getElementById("contact-form"),r=document.getElementById("form-status");t&&t.addEventListener("submit",a=>{a.preventDefault();const e=t.querySelector('button[type="submit"]'),l=e.innerHTML;e.disabled=!0,e.innerHTML="Writing Scribble... ✎",r.textContent="",setTimeout(()=>{y("Message sent! Thanks for leaving a scribble.","success"),e.disabled=!1,e.innerHTML=l,r.innerHTML='<span style="color:var(--ink-success)">✓ Scribble delivered to mailbox!</span>',t.reset()},1500)})}function H(){document.addEventListener("mousemove",t=>{const r=document.querySelectorAll(".floating-doodle"),a=t.clientX/window.innerWidth-.5,e=t.clientY/window.innerHeight-.5;r.forEach((l,u)=>{const c=(u+1)*15,h=a*c,g=e*c;l.style.transform=`translate(${h}px, ${g}px) rotate(${c+h*.2}deg)`})})}function y(t,r="success"){const a=document.getElementById("toast-container");if(!a)return;const e=document.createElement("div");e.className=`toast ${r}`;let l="★";r==="info"&&(l="✎"),r==="danger"&&(l="⚠"),e.innerHTML=`<span class="hand-drawn">${l}</span> <span>${t}</span>`,a.appendChild(e),setTimeout(()=>{e.classList.add("show")},10),setTimeout(()=>{e.classList.remove("show"),setTimeout(()=>{e.remove()},300)},3e3)}});
