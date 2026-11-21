import { useEffect, useState } from 'react';

type LoaderPhase = 'visible' | 'leaving' | 'removed';

export function BrandedLoader() {
  const [phase, setPhase] = useState<LoaderPhase>('visible');

  useEffect(() => {
    let minimumElapsed = false;
    let resourcesReady = document.readyState === 'complete';
    let hasStartedLeaving = false;
    let removeTimer = 0;

    const finishIfReady = () => {
      if (!minimumElapsed || !resourcesReady || hasStartedLeaving) return;
      hasStartedLeaving = true;
      setPhase('leaving');
      removeTimer = window.setTimeout(() => setPhase('removed'), 460);
    };

    const handleLoad = () => {
      resourcesReady = true;
      finishIfReady();
    };

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      finishIfReady();
    }, 680);
    const fallbackTimer = window.setTimeout(() => {
      minimumElapsed = true;
      resourcesReady = true;
      finishIfReady();
    }, 5500);

    if (resourcesReady) {
      finishIfReady();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(removeTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (phase === 'removed') return null;

  return (
    <div
      className="branded-loader"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-label="Loading Accessorable"
    >
      <div className="branded-loader-seal" aria-hidden="true">
        <span>A</span>
      </div>
      <p className="branded-loader-wordmark">ACCESSORABLE</p>
      <p className="branded-loader-caption">Curating the details</p>
      <div className="branded-loader-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
