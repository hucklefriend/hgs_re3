(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentRoute = document.body.dataset.route || "UNKNOWN NODE";
    let exitLocked = false;

    const transitionLayer = document.createElement("div");
    transitionLayer.className = "route-transition";
    transitionLayer.setAttribute("aria-hidden", "true");
    transitionLayer.innerHTML = `
        <div class="route-transition__gate route-transition__gate--a"></div>
        <div class="route-transition__gate route-transition__gate--b"></div>
        <div class="route-transition__readout">
            <span>HGN NETWORK STATUS</span>
            <strong>CONNECTED</strong>
            <small>NODE / <b>${currentRoute}</b></small>
        </div>`;
    document.body.append(transitionLayer);

    const routeStatus = transitionLayer.querySelector(".route-transition__readout strong");
    const routeLabel = transitionLayer.querySelector(".route-transition__readout small");

    const showCurrentRoute = () => {
        document.body.classList.add("is-ready");
        routeStatus.textContent = "CONNECTED";
        routeLabel.innerHTML = `NODE / <b>${currentRoute}</b>`;
        if (reducedMotion) {
            transitionLayer.classList.add("is-open");
            return;
        }
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => transitionLayer.classList.add("is-open"));
        });
    };

    const startExit = (destination) => {
        if (exitLocked) return;
        exitLocked = true;
        if (reducedMotion) {
            window.location.assign(destination.href);
            return;
        }

        document.body.classList.add("route-is-disconnecting");
        transitionLayer.classList.remove("is-open");
        transitionLayer.classList.add("is-closing");
        routeStatus.textContent = "DISCONNECTING";
        routeLabel.innerHTML = `NODE / <b>${currentRoute}</b>`;
        window.setTimeout(() => window.location.assign(destination.href), 190);
    };

    document.addEventListener("click", (event) => {
        const anchor = event.target.closest("a[href]");
        if (!anchor || event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;

        const rawHref = anchor.getAttribute("href");
        if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) return;

        const destination = new URL(anchor.href, document.baseURI);
        if (destination.protocol !== window.location.protocol || destination.host !== window.location.host) return;
        const sameDocument = destination.pathname === window.location.pathname && destination.search === window.location.search;
        if (sameDocument && destination.hash) return;

        event.preventDefault();
        startExit(destination);
    });

    document.querySelectorAll("form[action]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (event.defaultPrevented) return;
            const destination = new URL(form.action, document.baseURI);
            if (destination.protocol !== window.location.protocol || destination.host !== window.location.host) return;
            event.preventDefault();
            if ((form.method || "get").toLowerCase() === "get") {
                const parameters = new URLSearchParams();
                new FormData(form).forEach((value, key) => {
                    if (typeof value === "string" && value) parameters.append(key, value);
                });
                destination.search = parameters.toString();
            }
            startExit(destination);
        });
    });

    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;
        exitLocked = false;
        document.body.classList.remove("route-is-disconnecting");
        document.body.classList.add("is-ready");
        transitionLayer.classList.remove("is-closing");
        transitionLayer.classList.add("is-open");
    });

    showCurrentRoute();

    const clock = document.querySelector("[data-clock]");
    if (clock) {
        const updateClock = () => {
            clock.textContent = new Intl.DateTimeFormat("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(new Date());
        };
        updateClock();
        window.setInterval(updateClock, 1000);
    }

    const revealItems = document.querySelectorAll(".reveal-item");
    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => observer.observe(item));
    }

    const controls = document.querySelectorAll("[data-console-control]");
    const panels = document.querySelectorAll("[data-console-panel]");
    controls.forEach((control) => {
        control.addEventListener("click", () => {
            const target = control.dataset.consoleControl;
            controls.forEach((item) => {
                const selected = item === control;
                item.classList.toggle("is-active", selected);
                item.setAttribute("aria-pressed", String(selected));
            });
            panels.forEach((panel) => {
                const selected = panel.dataset.consolePanel === target;
                panel.hidden = !selected;
                panel.classList.toggle("is-active", selected);
            });
        });
    });

    const watchButton = document.querySelector("[data-watch]");
    if (watchButton) {
        watchButton.addEventListener("click", () => {
            const watched = watchButton.getAttribute("aria-pressed") !== "true";
            watchButton.setAttribute("aria-pressed", String(watched));
            watchButton.classList.toggle("is-watched", watched);
            const icon = watchButton.querySelector("span");
            const label = watchButton.querySelector("b");
            if (icon) icon.textContent = watched ? "\u2605" : "\u2606";
            if (label) label.textContent = watched ? "\u30a6\u30a9\u30c3\u30c1\u30ea\u30b9\u30c8\u306b\u8ffd\u52a0\u6e08\u307f" : "\u30a6\u30a9\u30c3\u30c1\u30ea\u30b9\u30c8\u306b\u8ffd\u52a0";
        });
    }

    const detailLinks = document.querySelectorAll(".detail-menu a");
    const detailSections = [...document.querySelectorAll(".data-section")];
    if (detailLinks.length && detailSections.length && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            detailLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
            });
        }, { rootMargin: "-15% 0px -60%", threshold: [0.1, 0.4] });
        detailSections.forEach((section) => sectionObserver.observe(section));
    }

    const canvas = document.querySelector("[data-network]");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let nodes = [];
    let animationFrame = 0;

    const createNodes = () => {
        const count = Math.max(14, Math.min(38, Math.round(width / 38)));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
            radius: Math.random() > 0.9 ? 1.6 : 0.7,
        }));
    };

    const resizeCanvas = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        createNodes();
    };

    const drawNetwork = () => {
        context.clearRect(0, 0, width, height);
        const connectionDistance = width < 740 ? 100 : 135;
        for (let index = 0; index < nodes.length; index += 1) {
            const node = nodes[index];
            if (!reducedMotion) {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
            }
            for (let peerIndex = index + 1; peerIndex < nodes.length; peerIndex += 1) {
                const peer = nodes[peerIndex];
                const distance = Math.hypot(node.x - peer.x, node.y - peer.y);
                if (distance >= connectionDistance) continue;
                context.strokeStyle = `rgba(87, 255, 139, ${(1 - distance / connectionDistance) * 0.12})`;
                context.lineWidth = 0.6;
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(peer.x, peer.y);
                context.stroke();
            }
            context.fillStyle = node.radius > 1 ? "rgba(87,255,139,.62)" : "rgba(166,255,194,.28)";
            context.beginPath();
            context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            context.fill();
        }
        if (!reducedMotion) animationFrame = window.requestAnimationFrame(drawNetwork);
    };

    resizeCanvas();
    drawNetwork();
    window.addEventListener("resize", () => {
        window.cancelAnimationFrame(animationFrame);
        resizeCanvas();
        drawNetwork();
    }, { passive: true });
})();
