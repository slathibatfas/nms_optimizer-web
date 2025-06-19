import { type FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructionsContent from '../components/AppDialog/InstructionsContent';
import InfoDialog from '../components/AppDialog/AppDialog';
import { useMarkdownContent } from "../hooks/useMarkdownContent";
import { APP_NAME } from "../constants";

interface InstructionsPageProps {
  onOpen?: () => void;
}

const InstructionsPage: FC<InstructionsPageProps> = ({ onOpen }) => {
  const navigate = useNavigate();
  const { isLoading, error } = useMarkdownContent("instructions");
  const instructionsDialogContent = useMemo(() => <InstructionsContent />, []);

  useEffect(() => {
    onOpen?.();
  }, [onOpen]);

    useEffect(() => {
    document.title = `Instructions | ${APP_NAME}`;
  }, []);

  return (
    <InfoDialog
      isOpen={!isLoading && !error}
      onClose={() => navigate("/")} // Navigate back
      content={instructionsDialogContent}
      title="Instructions"
    />
  );
};

export default InstructionsPage;