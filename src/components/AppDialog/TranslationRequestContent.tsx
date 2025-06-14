// src/components/AppDialog/TranslationRequestContent.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const TranslationRequestContent: React.FC = () => {
	const { t } = useTranslation();

	const content = t("dialogs.content.translationRequest");

	return (
		<article className="text-base">
			<ReactMarkdown
				components={{
					// Use React's standard HTML attributes for an anchor tag.
					// The 'node' prop is also passed by ReactMarkdown but often unused if you only care about attributes.
					a: ({
						children,
						...props
					}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => (
						<a {...props} target="_blank" rel="noopener noreferrer">
							{children}
						</a>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</article>
	);
};

export default React.memo(TranslationRequestContent);
