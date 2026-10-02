/* ============================================================
   1. PROJECTS: add new projects by adding an object to this list.
   Each project gets a card with buttons. Leave `live` or `code`
   as "" to hide that button.
   ============================================================ */
const projects = [
  // Example (remove the // to activate):
  // {
  //   title: "Multi-client Chat Server",
  //   description: "C++ server handling many clients at once.",
  //   tags: ["C++", "Sockets", "Threads"],
  //   live: "",
  //   code: "https://github.com/YOURUSERNAME/chat-server"
  // },
];

const grid = document.getElementById("projectGrid");

function renderProjects() {
  grid.innerHTML = "";
  if (projects.length === 0) {
    grid.innerHTML = '<div class="empty">Projects are on the way. Check back soon or see my GitHub. <a href="https://github.com/zainabad27" target="_blank" rel="noopener">Click Here</a></div>';
    return;
  }
  projects.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = p.title;

    const desc = document.createElement("p");
    desc.textContent = p.description;

    const tags = document.createElement("ul");
    tags.className = "tags";
    (p.tags || []).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      tags.appendChild(li);
    });

    const actions = document.createElement("div");
    actions.className = "actions";
    if (p.live) actions.appendChild(makeLink("View project", p.live, true));
    if (p.code) actions.appendChild(makeLink("Source code", p.code, false));

    card.append(title, desc, tags, actions);
    grid.appendChild(card);
  });
}

function makeLink(label, href, primary) {
  const a = document.createElement("a");
  a.className = "btn" + (primary ? " primary" : "");
  a.textContent = label;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

renderProjects();

/* ============================================================
   2. PROFILE PICTURE: shows the letter "Z" if profile.jpg is missing
   ============================================================ */
const pic = document.getElementById("profilePic");
const frame = pic.parentElement;
pic.addEventListener("error", () => frame.classList.add("no-img"));
if (pic.complete && pic.naturalWidth === 0) frame.classList.add("no-img");

/* ============================================================
   3. NETWORK BACKGROUND: nodes link up and follow the mouse
   ============================================================ */
(function network() {
  const canvas = document.getElementById("net");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rgb = getComputedStyle(document.documentElement).getPropertyValue("--node").trim();
  const mouse = { x: -999, y: -999 };
  let nodes = [], w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(90, Math.floor((w * h) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }

  function frameStep() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      if (!reduce) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, .7)`;
      ctx.fill();
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) link(nodes[i], nodes[j], 130, .25);
      link(nodes[i], mouse, 170, .6);
    }
    if (!reduce) requestAnimationFrame(frameStep);
  }

  function link(a, b, max, strength) {
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d > max) return;
    ctx.strokeStyle = `rgba(${rgb}, ${(1 - d / max) * strength})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  canvas.parentElement.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });
  window.addEventListener("resize", resize);

  resize();
  frameStep();
})();

document.getElementById("year").textContent = new Date().getFullYear();