import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collections from './components/Collections'
import ProductShowcase from './components/ProductShowcase'
import ArtisanStory from './components/ArtisanStory'
import WhyChooseUs from './components/WhyChooseUs'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import AdminPanel from './pages/AdminPanel'

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminPanel />
  }

  return (
    <div className="relative overflow-x-hidden" style={{ background: '#162540' }}>
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <ProductShowcase />
        <ArtisanStory />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

export default App
