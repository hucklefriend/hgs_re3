(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentRoute = document.body.dataset.route || "UNKNOWN NODE";
    const transferKey = "hgn-design2-node-transfer";
    let exitLocked = false;
    let pendingHash = window.location.hash;
    if (pendingHash) {
        try {
            window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
            window.scrollTo(0, 0);
        } catch (_) {
            // Native fragment navigation remains available if history is restricted.
        }
    }


    const brandMark = document.querySelector(".brand__mark");
    const brandPort = brandMark?.querySelector("i:nth-child(1)");

    const status = document.createElement("div");
    status.className = "node-status";
    status.setAttribute("aria-hidden", "true");
    status.innerHTML = `<span>HGN NODE HANDOFF</span><strong>CONNECTED / ${currentRoute}</strong>`;
    document.body.append(status);

    const fadeSelectors = [
        ".site-header .system-state",
        ".site-header .utility-nav",
        "main .enter-item",
        "main .reveal-item",
        "main .breadcrumb",
        "main .console-title",
        "main .console-layout",
        "main .game-keyart",
        "main .game-summary",
        "main .detail-menu",
        "main .detail-content",
        "main .scroll-cue",
        ".site-footer__inner",
    ];
    const fadeTargets = [...new Set(document.querySelectorAll(fadeSelectors.join(",")))];
    fadeTargets.forEach((target) => target.classList.add("node-fade-target"));

    const routeNameFromUrl = (url) => {
        const pathname = url.pathname.toLowerCase();
        if (pathname.endsWith("lineup.html")) return "DATABASE";
        if (pathname.endsWith("game.html")) return "GAME ENTRY";
        if (pathname.endsWith("index.html") || pathname.endsWith("new_design2/") || pathname.endsWith("new_design2")) return "ROOT";
        return "NEXT NODE";
    };

    const navigationDestination = (anchor) => {
        const rawHref = anchor.getAttribute("href");
        if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) return null;
        const destination = new URL(anchor.href, document.baseURI);
        if (destination.protocol !== window.location.protocol || destination.host !== window.location.host) return null;
        const sameDocument = destination.pathname === window.location.pathname && destination.search === window.location.search;
        if (sameDocument && destination.hash) return null;
        return destination;
    };

    const addTerminal = (element) => {
        if (!element || element.querySelector(":scope > .connection-terminal")) return null;
        element.classList.add("has-connection-terminal");
        const terminal = document.createElement("span");
        terminal.className = "connection-terminal";
        terminal.setAttribute("aria-hidden", "true");
        element.append(terminal);
        return terminal;
    };

    document.querySelectorAll("main a[href], .utility-nav a[href]").forEach((anchor) => {
        if (navigationDestination(anchor)) addTerminal(anchor);
    });
    document.querySelectorAll("form[action]").forEach((form) => {
        const submit = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submit) addTerminal(submit);
    });

    const particlePositions = [
        [-13, -8], [10, -11], [-9, 11], [13, 8],
        [-17, 2], [17, -2], [2, -16], [-2, 16],
    ];

    const createToken = (point, mode) => {
        const token = document.createElement("div");
        token.className = `node-handoff-token ${mode}`;
        token.setAttribute("aria-hidden", "true");
        token.innerHTML = '<span class="node-handoff-token__core"></span>';
        particlePositions.forEach(([x, y], index) => {
            const particle = document.createElement("i");
            particle.style.setProperty("--particle-x", `${x}px`);
            particle.style.setProperty("--particle-y", `${y}px`);
            particle.style.setProperty("--particle-delay", `${index * 0.012}s`);
            token.append(particle);
        });
        token.style.transform = `translate(${point.x - 9}px, ${point.y - 9}px)`;
        document.body.append(token);
        return token;
    };

    const documentPoint = (element) => {
        const rect = element?.getBoundingClientRect();
        if (!rect) return null;
        return {
            x: rect.left + window.scrollX + rect.width * 0.5,
            y: rect.top + window.scrollY + rect.height * 0.5,
        };
    };

    const brandPortPoint = () => {
        return documentPoint(brandPort) || { x: 40, y: 28 };
    };

    const elementPoint = (element) => {
        return documentPoint(element) || { x: window.scrollX, y: window.scrollY };
    };

    const setTokenPoint = (token, point, scale = 1) => {
        token.style.transform = `translate(${point.x - 9}px, ${point.y - 9}px) scale(${scale})`;
    };

    const animateDocumentHandoff = (token, origin, destination, duration, onComplete) => {
        const startedAt = performance.now();
        const startingScroll = window.scrollY;
        const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 72;
        const originViewportY = origin.y - startingScroll;
        const trackingY = Math.max(headerHeight + 24, originViewportY);
        const revealScroll = Math.max(0, Math.min(startingScroll, origin.y - trackingY));
        const needsReveal = originViewportY < headerHeight + 16;
        const revealShare = needsReveal ? Math.min(0.24, 110 / duration) : 0;

        const step = (time) => {
            const progress = Math.min((time - startedAt) / duration, 1);
            let travelProgress = progress;

            if (revealShare > 0 && progress < revealShare) {
                const revealProgress = progress / revealShare;
                const revealEased = 1 - Math.pow(1 - revealProgress, 3);
                window.scrollTo(0, startingScroll + (revealScroll - startingScroll) * revealEased);
                setTokenPoint(token, origin);
            } else {
                if (revealShare > 0) travelProgress = (progress - revealShare) / (1 - revealShare);
                const eased = 1 - Math.pow(1 - travelProgress, 3);
                const point = {
                    x: origin.x + (destination.x - origin.x) * eased,
                    y: origin.y + (destination.y - origin.y) * eased,
                };
                const desiredScroll = Math.max(0, point.y - trackingY);
                window.scrollTo(0, desiredScroll);
                setTokenPoint(token, point, 1 - eased * 0.22);
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
                return;
            }
            window.scrollTo(0, 0);
            setTokenPoint(token, destination, 0.78);
            onComplete();
        };

        window.requestAnimationFrame(step);
    };

    const saveTransfer = (destination) => {
        try {
            window.sessionStorage.setItem(transferKey, JSON.stringify({
                from: currentRoute,
                to: routeNameFromUrl(destination),
                timestamp: Date.now(),
            }));
        } catch (_) {
            // The visual handoff does not depend on storage.
        }
    };

    const readTransfer = () => {
        try {
            const raw = window.sessionStorage.getItem(transferKey);
            window.sessionStorage.removeItem(transferKey);
            if (!raw) return null;
            const transfer = JSON.parse(raw);
            if (!transfer.timestamp || Date.now() - transfer.timestamp > 15000) return null;
            return transfer;
        } catch (_) {
            return null;
        }
    };
    const restorePendingHash = () => {
        if (!pendingHash) return;
        const hash = pendingHash;
        pendingHash = "";
        const rawId = hash.slice(1);
        let id;
        try {
            id = decodeURIComponent(rawId);
        } catch (_) {
            id = rawId;
        }
        const target = document.getElementById(id);
        try {
            window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
        } catch (_) {
            // Keep the current URL when history replacement is restricted.
        }
        if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    };

    const runArrival = () => {
        const transfer = readTransfer();
        document.body.classList.remove("node-departing");
        document.body.classList.add("node-arriving");
        brandMark?.classList.add("is-connected");
        status.classList.remove("is-idle");
        status.querySelector("strong").textContent = `CONNECTED / ${currentRoute}`;

        if (reducedMotion) {
            document.body.classList.add("node-arrival-open", "is-ready");
            restorePendingHash();
            return;
        }

        const token = createToken(brandPortPoint(), "is-arriving");
        if (transfer) token.dataset.from = transfer.from;
        window.requestAnimationFrame(() => {
            document.body.classList.add("node-arrival-open", "is-ready");
        });
        window.setTimeout(() => brandMark?.classList.remove("is-connected"), 300);
        window.setTimeout(() => {
            token.remove();
            restorePendingHash();
        }, 320);
        window.setTimeout(() => {
            document.body.classList.remove("node-arriving", "node-arrival-open");
            status.classList.add("is-idle");
        }, 620);
    };

    const startExit = (destination, originElement) => {
        if (exitLocked) return;
        exitLocked = true;
        saveTransfer(destination);

        if (reducedMotion) {
            window.location.assign(destination.href);
            return;
        }

        const origin = elementPoint(originElement);
        const destinationPoint = brandPortPoint();
        const travelDistance = Math.hypot(destinationPoint.x - origin.x, destinationPoint.y - origin.y);
        const duration = Math.min(560, Math.max(230, 210 + travelDistance * 0.12));
        const token = createToken(origin, "is-flying");
        originElement.classList.add("is-selected");
        document.documentElement.classList.add("node-camera-tracking");
        document.body.classList.add("node-departing");
        status.classList.remove("is-idle");
        status.querySelector("strong").textContent = `ROUTING / ${routeNameFromUrl(destination)}`;

        window.setTimeout(() => brandMark?.classList.add("is-receiving"), Math.max(120, duration - 90));
        animateDocumentHandoff(token, origin, destinationPoint, duration, () => {
            window.setTimeout(() => window.location.assign(destination.href), 20);
        });
    };

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const anchor = event.target.closest("a[href]");
        if (!anchor || event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
        const destination = navigationDestination(anchor);
        if (!destination) return;

        event.preventDefault();
        const terminal = anchor.querySelector(":scope > .connection-terminal");
        startExit(destination, terminal || anchor);
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
            const submit = form.querySelector('button[type="submit"], input[type="submit"]');
            const terminal = submit?.querySelector(":scope > .connection-terminal");
            startExit(destination, terminal || submit || form);
        });
    });

    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) return;
        exitLocked = false;
        brandMark?.classList.remove("is-receiving");
        document.documentElement.classList.remove("node-camera-tracking");
        document.querySelectorAll(".connection-terminal.is-selected").forEach((terminal) => terminal.classList.remove("is-selected"));
        document.querySelectorAll(".node-handoff-token").forEach((token) => token.remove());
        runArrival();
    });

    runArrival();

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
