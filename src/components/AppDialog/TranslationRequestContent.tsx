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
					a: ({ node, ...props }) => (
						<a {...props} target="_blank" rel="noopener noreferrer">
							{props.children}
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
