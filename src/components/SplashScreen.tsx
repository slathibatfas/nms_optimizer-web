import {
	useEffect,
	useState,
	type CSSProperties,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";

const splashScreenStyles = `
  .SplashScreen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    position: fixed;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 99999;
    opacity: 1;
  }

  .SplashScreen--hidden {
    pointer-events: none;
    animation: SplashScreen-hide 500ms forwards;
  }

  @keyframes SplashScreen-hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .SplashScreen__loader {
    display: inline-block;
    position: relative;
    width: 72px;
    height: 10px;
  }

  .SplashScreen__dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--vpss-bg-loader, #00A2C7);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  .SplashScreen__loader .SplashScreen__dot:nth-child(1) {
    left: 8px;
    animation: SplashScreen-dot1 0.6s infinite;
  }

  .SplashScreen__loader .SplashScreen__dot:nth-child(2) {
    left: 8px;
    animation: SplashScreen-dot2 0.6s infinite;
  }

  .SplashScreen__loader .SplashScreen__dot:nth-child(3) {
    left: 32px;
    animation: SplashScreen-dot2 0.6s infinite;
  }

  .SplashScreen__loader .SplashScreen__dot:nth-child(4) {
    left: 56px;
    animation: SplashScreen-dot3 0.6s infinite;
  }

  @keyframes SplashScreen-dot1 {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }

  @keyframes SplashScreen-dot2 {
    0% { transform: translate(0, 0); }
    100% { transform: translate(24px, 0); }
  }

  @keyframes SplashScreen-dot3 {
    0% { transform: scale(1); }
    100% { transform: scale(0); }
  }
`;

export interface SplashScreenHandle {
	hide: () => void;
}

interface SplashScreenProps {
	minDurationMs?: number;
	onHidden?: () => void; // Callback when fully hidden and removed
}

const SplashScreen = forwardRef<SplashScreenHandle, SplashScreenProps>(
	({ minDurationMs = 0, onHidden }, ref) => {
		const [status, setStatus] = useState<"pending" | "visible" | "hiding" | "hidden">("pending");
		const elementRef = useRef<HTMLDivElement>(null);
		const renderedAtRef = useRef<number>(0);
		const cssBlock = "SplashScreen"; // BEM Block name, also used for URL param

		useEffect(() => {
			renderedAtRef.current = new Date().getTime();
			const url = new URL(window.location.href);
			const urlParams = new URLSearchParams(url.search);
			const param = urlParams.get(cssBlock); // Check for ?SplashScreen=false

			let shouldBeVisible = true;
			if (param === "false") {
				shouldBeVisible = false;
			}

			if (param) {
				urlParams.delete(cssBlock);
				url.search = urlParams.toString();
				window.history.replaceState({}, "", url.toString());
			}

			setStatus(shouldBeVisible ? "visible" : "hidden");
		}, [cssBlock]);

		useImperativeHandle(ref, () => ({
			async hide() {
				if (status !== "visible" || !elementRef.current) return;

				const elapsedTime = new Date().getTime() - renderedAtRef.current;
				const remainingTime = Math.max(minDurationMs - elapsedTime, 0);

				if (remainingTime > 0) {
					await new Promise((resolve) => setTimeout(resolve, remainingTime));
				}
				setStatus("hiding");
			},
		}));

		useEffect(() => {
			const element = elementRef.current;
			if (status === "hiding" && element) {
				const handleAnimationEnd = (event: AnimationEvent) => {
					if (event.animationName === `${cssBlock}-hide`) {
						setStatus("hidden");
						onHidden?.();
						element.removeEventListener("animationend", handleAnimationEnd as EventListener);
					}
				};
				element.addEventListener("animationend", handleAnimationEnd as EventListener);
				element.classList.add(`${cssBlock}--hidden`); // Trigger animation

				return () => {
					element.removeEventListener("animationend", handleAnimationEnd as EventListener);
				};
			}
		}, [status, cssBlock, onHidden]);

		if (status === "hidden" || status === "pending") {
			return null;
		}

		return (
			<>
				<style>{splashScreenStyles}</style>
				<div
					className={cssBlock}
					ref={elementRef}
					style={{ visibility: "visible" } as CSSProperties} // Made visible by JS when status is 'visible'
				>
					<div className={`${cssBlock}__loader`}>
						<div className={`${cssBlock}__dot`}></div>
						<div className={`${cssBlock}__dot`}></div>
						<div className={`${cssBlock}__dot`}></div>
						<div className={`${cssBlock}__dot`}></div>
					</div>
				</div>
			</>
		);
	}
);

SplashScreen.displayName = "SplashScreen";
export default SplashScreen;
