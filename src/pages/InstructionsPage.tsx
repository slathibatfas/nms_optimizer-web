import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructionsContent from '../components/AppDialog/InstructionsContent';
import InfoDialog from '../components/AppDialog/AppDialog';
import { APP_NAME } from "../constants";

interface InstructionsPageProps {
  onOpen?: () => void;
  rootPathSearch: string;
}

const InstructionsPage: FC<InstructionsPageProps> = ({ onOpen, rootPathSearch }) => {
  const navigate = useNavigate();
  const instructionsDialogContent = useMemo(() => <InstructionsContent />, []);

  useEffect(() => {
    onOpen?.();
  }, [onOpen]);

    useEffect(() => {
    document.title = `Instructions | ${APP_NAME}`;
  }, []);

  return (
    <InfoDialog
      isOpen={true}
      onClose={() => navigate("/")} // Navigate back
      content={instructionsDialogContent}
      title="Instructions"
    />
  );
};

export default InstructionsPage;