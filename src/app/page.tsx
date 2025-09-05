import Layout from './layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './home/page'
import GlossaryPage from '@/features/glossary/page'
import CacheSetVisualizer from '@/features/cache/cache-set-visualizer'
import StrideLab from '@/features/cache/stride-lab'
import MESISimulator from '@/features/coherence/mesi-simulator'
import TLBWalk from '@/features/tlb/tlb-walk'
import DRAMBankMatrix from '@/features/dram/dram-bank-matrix'
import RowBufferDemo from '@/features/dram/row-buffer-demo'
import StoreLoadLab from '@/features/consistency/store-load-lab'
import FencesVisualizer from '@/features/consistency/fences-visualizer'
import FalseSharingDemo from '@/features/cache/false-sharing-demo'
import BuddyAllocatorViz from '@/features/allocators/buddy-allocator-viz'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/cache/set-visualizer" element={<CacheSetVisualizer />} />
          <Route path="/cache/stride-lab" element={<StrideLab />} />
          <Route path="/cache/false-sharing" element={<FalseSharingDemo />} />
          <Route path="/coherence/mesi-simulator" element={<MESISimulator />} />
          <Route path="/tlb/tlb-walk" element={<TLBWalk />} />
          <Route path="/dram/bank-matrix" element={<DRAMBankMatrix />} />
          <Route path="/dram/row-buffer-demo" element={<RowBufferDemo />} />
          <Route path="/consistency/store-load-lab" element={<StoreLoadLab />} />
          <Route path="/consistency/fences-visualizer" element={<FencesVisualizer />} />
          <Route path="/allocators/buddy-allocator" element={<BuddyAllocatorViz />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}