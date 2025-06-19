import { type FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeLogContent from '../components/AppDialog/ChangeLogContent';
import InfoDialog from '../components/AppDialog/AppDialog';
import { APP_NAME } from "../constants";

const ChangelogPage: FC = () => {
  const navigate = useNavigate();
  const changeLogDialogContent = useMemo(() => <ChangeLogContent />, []);

  useEffect(() => {
    document.title = `Changelog | ${APP_NAME}`;
  }, []);

  return (
    <InfoDialog
      isOpen={true}
      onClose={() => navigate("/")} // Navigate back
      content={changeLogDialogContent}
      title="Changelog"
    />
  );
};

export default ChangelogPage;