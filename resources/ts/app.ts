import { HorrorGameNetwork } from './horror-game-network';

declare global {
    interface Window {
        hgn: HorrorGameNetwork;
    }
}

window.hgn = HorrorGameNetwork.getInstance();

document.addEventListener('DOMContentLoaded', () => {
    window.hgn.start();
});
