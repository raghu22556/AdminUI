import SignupForm from '../../../components/SignupForm';
import Footer from '../../../common/Footer';
import { welcomePage } from '../../../components/Welcome';

export default () => {
  return welcomePage(SignupForm, Footer);
};
