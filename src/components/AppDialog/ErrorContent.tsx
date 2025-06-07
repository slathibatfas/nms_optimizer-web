import React from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const ErrorContent: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8">
			<ExclamationTriangleIcon className="w-16 h-16 shadow-lg errorContent__icon" />
			<h2 className="pt-2 text-2xl font-semibold tracking-widest text-center errorContent__title">
				–kzzkt– Signal Disruption! –kzzkt–
			</h2>
			<p className="pt-1 text-base text-center appContent__text">
				<strong>
					The server returned an error while attempting to optimize
					your layout.
				</strong>{' '}
				If the issue persists, please consider{' '}
				<a
					href="https://github.com/jbelew/nms_optimizer-web/issues"
					target="_blank"
					rel="noopener noreferrer"
					className="underline"
				>
					filing a bug report
				</a>
				.
			</p>
		</div>
	);
};

export default React.memo(ErrorContent);
