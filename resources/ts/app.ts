import { HorrorGameNetwork } from './horror-game-network';

declare global {
    interface Window {
        hgn: HorrorGameNetwork;
    }
}

window.hgn = HorrorGameNetwork.getInstance();

window.addEventListener('load', () => {
    window.hgn.start();
});
