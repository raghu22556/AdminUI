import LoginForm from '../../../components/LoginForm';
import Footer from '../../../common/Footer';
import { welcomePage } from '../../../components/Welcome';

export default () => {
  return welcomePage(LoginForm, Footer);
};
