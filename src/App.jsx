import Header from './components/Header/Header';
import Generator from './components/Generator/Generator';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px' }}>
        <Generator />
      </main>
      <Footer />
    </>
  );
}
