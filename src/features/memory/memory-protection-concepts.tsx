import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function MemoryProtectionConcepts() {
  const [config, setConfig] = useState({
    memorySize: 1048576, // 1MB
    protectionType: "paging" as "paging" | "segmentation" | "hybrid",
    accessControl: "user" as "user" | "kernel" | "supervisor" | "hypervisor",
    permissionModel: "rwx" as "rwx" | "capabilities" | "accessControlList",
    attackType: "bufferOverflow" as "bufferOverflow" | "useAfterFree" | "privilegeEscalation" | "memoryLeak",
    simulationSpeed: 300 // ms
  })
  
  const [protection, setProtection] = useState({
    memoryRegions: [] as {
      id: number,
      name: string,
      base: number,
      size: number,
      permissions: {
        read: boolean,
        write: boolean,
        execute: boolean,
        user: boolean,
        kernel: boolean,
        supervisor: boolean,
        hypervisor: boolean
      },
      protected: boolean,
      violations: number,
      lastAccess: number
    }[],
    accessControlLists: [] as {
      id: number,
      resourceId: number,
      subjects: {
        id: number,
        name: string,
        permissions: string[]
      }[]
    }[],
    capabilities: [] as {
      id: number,
      name: string,
      permissions: string[],
      holder: number
    }[],
    pageTables: [] as {
      id: number,
      virtualAddress: number,
      physicalAddress: number,
      permissions: {
        present: boolean,
        writable: boolean,
        user: boolean,
        executable: boolean,
        accessed: boolean,
        dirty: boolean
      },
      protected: boolean,
      violations: number
    }[],
    segmentDescriptors: [] as {
      id: number,
      base: number,
      limit: number,
      type: "code" | "data" | "stack" | "heap",
      permissions: {
        present: boolean,
        writable: boolean,
        executable: boolean,
        user: boolean,
        dpl: number // Descriptor Privilege Level
      },
      protected: boolean,
      violations: number
    }[],
    statistics: {
      validAccesses: 0,
      invalidAccesses: 0,
      protectionViolations: 0,
      attackSuccesses: 0,
      attackBlocks: 0,
      protectionEffectiveness: 0
    }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  // Initialize memory protection
  useState(() => {
    // Create memory regions
    const memoryRegions = [
      {
        id: 0,
        name: "Kernel Code",
        base: 0x000000,
        size: 0x100000, // 1MB
        permissions: {
          read: true,
          write: false,
          execute: true,
          user: false,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 1,
        name: "Kernel Data",
        base: 0x100000,
        size: 0x100000, // 1MB
        permissions: {
          read: true,
          write: true,
          execute: false,
          user: false,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 2,
        name: "User Code",
        base: 0x200000,
        size: 0x200000, // 2MB
        permissions: {
          read: true,
          write: false,
          execute: true,
          user: true,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 3,
        name: "User Data",
        base: 0x400000,
        size: 0x400000, // 4MB
        permissions: {
          read: true,
          write: true,
          execute: false,
          user: true,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 4,
        name: "Shared Memory",
        base: 0x800000,
        size: 0x200000, // 2MB
        permissions: {
          read: true,
          write: true,
          execute: false,
          user: true,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      }
    ]
    
    // Create access control lists
    const accessControlLists = [
      {
        id: 0,
        resourceId: 0,
        subjects: [
          { id: 0, name: "Kernel", permissions: ["read", "execute"] },
          { id: 1, name: "System Services", permissions: ["read"] }
        ]
      },
      {
        id: 1,
        resourceId: 1,
        subjects: [
          { id: 0, name: "Kernel", permissions: ["read", "write"] },
          { id: 2, name: "Drivers", permissions: ["read", "write"] }
        ]
      },
      {
        id: 2,
        resourceId: 2,
        subjects: [
          { id: 3, name: "User Process 1", permissions: ["read", "execute"] },
          { id: 4, name: "User Process 2", permissions: ["read", "execute"] }
        ]
      },
      {
        id: 3,
        resourceId: 3,
        subjects: [
          { id: 3, name: "User Process 1", permissions: ["read", "write"] },
          { id: 4, name: "User Process 2", permissions: ["read", "write"] }
        ]
      },
      {
        id: 4,
        resourceId: 4,
        subjects: [
          { id: 3, name: "User Process 1", permissions: ["read", "write"] },
          { id: 4, name: "User Process 2", permissions: ["read", "write"] },
          { id: 0, name: "Kernel", permissions: ["read", "write"] }
        ]
      }
    ]
    
    // Create capabilities
    const capabilities = [
      {
        id: 0,
        name: "Kernel Execute",
        permissions: ["execute"],
        holder: 0
      },
      {
        id: 1,
        name: "Kernel ReadWrite",
        permissions: ["read", "write"],
        holder: 0
      },
      {
        id: 2,
        name: "User Execute",
        permissions: ["execute"],
        holder: 3
      },
      {
        id: 3,
        name: "User ReadWrite",
        permissions: ["read", "write"],
        holder: 3
      },
      {
        id: 4,
        name: "Shared Access",
        permissions: ["read", "write"],
        holder: 3
      }
    ]
    
    // Create page tables
    const pageTables = []
    const pageSize = 4096 // 4KB pages
    const totalPages = Math.ceil(config.memorySize / pageSize)
    
    for (let i = 0; i < totalPages; i++) {
      const virtualAddress = i * pageSize
      const physicalAddress = virtualAddress // Simplified mapping
      
      // Determine permissions based on region
      const permissions = {
        present: true,
        writable: false,
        user: false,
        executable: false,
        accessed: false,
        dirty: false
      }
      
      // Find which region this page belongs to
      const region = memoryRegions.find(r => 
        virtualAddress >= r.base && virtualAddress < r.base + r.size
      )
      
      if (region) {
        permissions.writable = region.permissions.write
        permissions.user = region.permissions.user
        permissions.executable = region.permissions.execute
      }
      
      pageTables.push({
        id: i,
        virtualAddress,
        physicalAddress,
        permissions,
        protected: true,
        violations: 0
      })
    }
    
    // Create segment descriptors
    const segmentDescriptors = [
      {
        id: 0,
        base: 0x000000,
        limit: 0x100000, // 1MB
        type: "code" as const,
        permissions: {
          present: true,
          writable: false,
          executable: true,
          user: false,
          dpl: 0 // Kernel level
        },
        protected: true,
        violations: 0
      },
      {
        id: 1,
        base: 0x100000,
        limit: 0x100000, // 1MB
        type: "data" as const,
        permissions: {
          present: true,
          writable: true,
          executable: false,
          user: false,
          dpl: 0 // Kernel level
        },
        protected: true,
        violations: 0
      },
      {
        id: 2,
        base: 0x200000,
        limit: 0x200000, // 2MB
        type: "code" as const,
        permissions: {
          present: true,
          writable: false,
          executable: true,
          user: true,
          dpl: 3 // User level
        },
        protected: true,
        violations: 0
      },
      {
        id: 3,
        base: 0x400000,
        limit: 0x400000, // 4MB
        type: "data" as const,
        permissions: {
          present: true,
          writable: true,
          executable: false,
          user: true,
          dpl: 3 // User level
        },
        protected: true,
        violations: 0
      },
      {
        id: 4,
        base: 0x800000,
        limit: 0x200000, // 2MB
        type: "data" as const,
        permissions: {
          present: true,
          writable: true,
          executable: false,
          user: true,
          dpl: 3 // User level
        },
        protected: true,
        violations: 0
      }
    ]
    
    setProtection({
      memoryRegions,
      accessControlLists,
      capabilities,
      pageTables,
      segmentDescriptors,
      statistics: {
        validAccesses: 0,
        invalidAccesses: 0,
        protectionViolations: 0,
        attackSuccesses: 0,
        attackBlocks: 0,
        protectionEffectiveness: 0
      }
    })
  })

  // Simulate memory protection
  const simulateMemoryProtection = async () => {
    setIsRunning(true)
    setProgress(0)
    setHistory([])
    
    // Reset statistics
    setProtection(prev => ({
      ...prev,
      statistics: {
        validAccesses: 0,
        invalidAccesses: 0,
        protectionViolations: 0,
        attackSuccesses: 0,
        attackBlocks: 0,
        protectionEffectiveness: 0
      }
    }))
    
    // Run simulation
    for (let step = 0; step < 100; step++) {
      setProgress((step + 1) * 1)
      
      // Create a copy of current protection state (keep typing)
      const currentProtection = JSON.parse(JSON.stringify(protection)) as typeof protection
      const currentStatistics = { ...protection.statistics }
      
      // Generate memory access based on configuration
      const accessType = Math.random()
      let address: number
      let operation: "read" | "write" | "execute"
      let accessLevel: "user" | "kernel" | "supervisor" | "hypervisor"
      
      // Determine access type
      if (accessType < 0.33) {
        operation = "read"
      } else if (accessType < 0.66) {
        operation = "write"
      } else {
        operation = "execute"
      }
      
      // Determine access level
      const accessLevelType = Math.random()
      if (accessLevelType < 0.25) {
        accessLevel = "user"
      } else if (accessLevelType < 0.5) {
        accessLevel = "kernel"
      } else if (accessLevelType < 0.75) {
        accessLevel = "supervisor"
      } else {
        accessLevel = "hypervisor"
      }
      
      // Determine address based on attack type
      if (config.attackType === "bufferOverflow") {
        // Target addresses near boundaries to simulate buffer overflow
        const boundaryRegion = currentProtection.memoryRegions[
          Math.floor(Math.random() * currentProtection.memoryRegions.length)
        ]
        address = boundaryRegion.base + boundaryRegion.size - Math.floor(Math.random() * 1024)
      } else if (config.attackType === "useAfterFree") {
        // Target addresses in freed memory regions
        const freedRegion = currentProtection.memoryRegions[
          Math.floor(Math.random() * currentProtection.memoryRegions.length)
        ]
        address = freedRegion.base + Math.floor(Math.random() * freedRegion.size)
      } else if (config.attackType === "privilegeEscalation") {
        // Target kernel addresses from user level
        const kernelRegion = currentProtection.memoryRegions.find(r => r.name.includes("Kernel"))
        if (kernelRegion) {
          address = kernelRegion.base + Math.floor(Math.random() * kernelRegion.size)
        } else {
          address = Math.floor(Math.random() * config.memorySize)
        }
      } else {
        // Normal access pattern
        address = Math.floor(Math.random() * config.memorySize)
      }
      
      // Check if access is allowed based on protection mechanism
      let accessAllowed = false
      let violationType = ""
      
      // Find which region this address belongs to
      const region = currentProtection.memoryRegions.find(r => 
        address >= r.base && address < r.base + r.size
      )
      
      if (region) {
        // Check access permissions
        if (operation === "read" && region.permissions.read) {
          accessAllowed = true
        } else if (operation === "write" && region.permissions.write) {
          accessAllowed = true
        } else if (operation === "execute" && region.permissions.execute) {
          accessAllowed = true
        } else {
          violationType = `Permission denied for ${operation} on ${region.name}`
        }
        
        // Check access level permissions
        if (accessAllowed) {
          if (accessLevel === "user" && !region.permissions.user) {
            accessAllowed = false
            violationType = `User access denied to ${region.name}`
          } else if (accessLevel === "kernel" && !region.permissions.kernel) {
            accessAllowed = false
            violationType = `Kernel access denied to ${region.name}`
          } else if (accessLevel === "supervisor" && !region.permissions.supervisor) {
            accessAllowed = false
            violationType = `Supervisor access denied to ${region.name}`
          } else if (accessLevel === "hypervisor" && !region.permissions.hypervisor) {
            accessAllowed = false
            violationType = `Hypervisor access denied to ${region.name}`
          }
        }
        
        // Apply protection mechanisms based on type
        if (config.protectionType === "paging") {
          // Check page table permissions
          const pageSize = 4096
          const pageNumber = Math.floor(address / pageSize)
          const pageEntry = currentProtection.pageTables.find(p => p.id === pageNumber)
          
          if (pageEntry) {
            // Check page permissions
            if (operation === "read" && !pageEntry.permissions.present) {
              accessAllowed = false
              violationType = "Page not present"
            } else if (operation === "write" && !pageEntry.permissions.writable) {
              accessAllowed = false
              violationType = "Page not writable"
            } else if (operation === "execute" && !pageEntry.permissions.executable) {
              accessAllowed = false
              violationType = "Page not executable"
            }
            
            // Check access level
            if (accessAllowed && accessLevel === "user" && !pageEntry.permissions.user) {
              accessAllowed = false
              violationType = "User access denied to page"
            }
          }
        } else if (config.protectionType === "segmentation") {
          // Check segment descriptor permissions
          const segment = currentProtection.segmentDescriptors.find(s => 
            address >= s.base && address < s.base + s.limit
          )
          
          if (segment) {
            // Check segment permissions
            if (operation === "read" && !segment.permissions.present) {
              accessAllowed = false
              violationType = "Segment not present"
            } else if (operation === "write" && !segment.permissions.writable) {
              accessAllowed = false
              violationType = "Segment not writable"
            } else if (operation === "execute" && !segment.permissions.executable) {
              accessAllowed = false
              violationType = "Segment not executable"
            }
            
            // Check access level (DPL)
            const accessLevelNumber = 
              accessLevel === "user" ? 3 : 
              accessLevel === "kernel" ? 0 : 
              accessLevel === "supervisor" ? 1 : 2
            
            if (accessAllowed && accessLevelNumber > segment.permissions.dpl) {
              accessAllowed = false
              violationType = `Access level ${accessLevelNumber} exceeds DPL ${segment.permissions.dpl}`
            }
          }
        } else if (config.protectionType === "hybrid") {
          // Combine paging and segmentation checks
          // (Implementation would be similar to above but combined)
        }
        
        // Apply access control model
        if (config.permissionModel === "capabilities") {
          // Check if accessor has required capability
          const requiredCapability = 
            operation === "read" ? "read" : 
            operation === "write" ? "write" : "execute"
            
          const hasCapability = currentProtection.capabilities.some(cap => 
            cap.holder === (accessLevel === "user" ? 3 : 0) && 
            cap.permissions.includes(requiredCapability)
          )
          
          if (!hasCapability) {
            accessAllowed = false
            violationType = `Missing capability for ${operation}`
          }
        } else if (config.permissionModel === "accessControlList") {
          // Check ACL for resource
          const resourceId = currentProtection.memoryRegions.findIndex(r => 
            address >= r.base && address < r.base + r.size
          )
          
          if (resourceId !== -1) {
            const acl = currentProtection.accessControlLists.find(a => a.resourceId === resourceId)
            if (acl) {
              const subjectId = accessLevel === "user" ? 3 : 0
              const subject = acl.subjects.find(s => s.id === subjectId)
              
              if (!subject || !subject.permissions.includes(operation)) {
                accessAllowed = false
                violationType = `ACL denies ${operation} for ${accessLevel}`
              }
            }
          }
        }
      } else {
        // Address not in any known region
        accessAllowed = false
        violationType = "Invalid memory address"
      }
      
      // Update statistics
      if (accessAllowed) {
        currentStatistics.validAccesses++
      } else {
        currentStatistics.invalidAccesses++
        currentStatistics.protectionViolations++
        
        // Update region violations
        if (region) {
          const regionIndex = currentProtection.memoryRegions.findIndex(r => r.id === region.id)
          if (regionIndex !== -1) {
            currentProtection.memoryRegions[regionIndex].violations++
            currentProtection.memoryRegions[regionIndex].lastAccess = step
          }
        }
        
        // Update page table violations
        if (config.protectionType === "paging") {
          const pageSize = 4096
          const pageNumber = Math.floor(address / pageSize)
          const pageEntryIndex = currentProtection.pageTables.findIndex(p => p.id === pageNumber)
          
          if (pageEntryIndex !== -1) {
            currentProtection.pageTables[pageEntryIndex].violations++
          }
        }
        
        // Update segment descriptor violations
        if (config.protectionType === "segmentation") {
          const segmentIndex = currentProtection.segmentDescriptors.findIndex(s => 
            address >= s.base && address < s.base + s.limit
          )
          
          if (segmentIndex !== -1) {
            currentProtection.segmentDescriptors[segmentIndex].violations++
          }
        }
        
        // Check if this was an attack attempt
        const isAttack = 
          config.attackType === "bufferOverflow" || 
          config.attackType === "useAfterFree" || 
          config.attackType === "privilegeEscalation"
          
        if (isAttack) {
          // Attack attempt - check if blocked
          if (accessAllowed) {
            currentStatistics.attackSuccesses++
          } else {
            currentStatistics.attackBlocks++
          }
        }
      }
      
      // Calculate protection effectiveness
      const totalAccesses = currentStatistics.validAccesses + currentStatistics.invalidAccesses
      currentStatistics.protectionEffectiveness = totalAccesses > 0 
        ? (currentStatistics.validAccesses / totalAccesses) * 100 
        : 0
      
      // Update state
      currentProtection.statistics = currentStatistics
      setProtection(currentProtection)
      
      // Add to history every 10 steps
      if (step % 10 === 0) {
        setHistory(prev => [...prev, {
          step,
          validAccesses: currentStatistics.validAccesses,
          invalidAccesses: currentStatistics.invalidAccesses,
          protectionViolations: currentStatistics.protectionViolations,
          attackSuccesses: currentStatistics.attackSuccesses,
          attackBlocks: currentStatistics.attackBlocks,
          protectionEffectiveness: currentStatistics.protectionEffectiveness
        }])
      }
      
      // Add delay for visualization
      await new Promise(resolve => setTimeout(resolve, config.simulationSpeed / 100))
    }
    
    setProgress(100)
    setIsRunning(false)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setHistory([])
    
    // Reset protection state
    const memoryRegions = [
      {
        id: 0,
        name: "Kernel Code",
        base: 0x000000,
        size: 0x100000, // 1MB
        permissions: {
          read: true,
          write: false,
          execute: true,
          user: false,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 1,
        name: "Kernel Data",
        base: 0x100000,
        size: 0x100000, // 1MB
        permissions: {
          read: true,
          write: true,
          execute: false,
          user: false,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 2,
        name: "User Code",
        base: 0x200000,
        size: 0x200000, // 2MB
        permissions: {
          read: true,
          write: false,
          execute: true,
          user: true,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 3,
        name: "User Data",
        base: 0x400000,
        size: 0x400000, // 4MB
        permissions: {
          read: true,
          write: true,
          execute: false,
          user: true,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      },
      {
        id: 4,
        name: "Shared Memory",
        base: 0x800000,
        size: 0x200000, // 2MB
        permissions: {
          read: true,
          write: true,
          execute: false,
          user: true,
          kernel: true,
          supervisor: true,
          hypervisor: true
        },
        protected: true,
        violations: 0,
        lastAccess: 0
      }
    ]
    
    const accessControlLists = [
      {
        id: 0,
        resourceId: 0,
        subjects: [
          { id: 0, name: "Kernel", permissions: ["read", "execute"] },
          { id: 1, name: "System Services", permissions: ["read"] }
        ]
      },
      {
        id: 1,
        resourceId: 1,
        subjects: [
          { id: 0, name: "Kernel", permissions: ["read", "write"] },
          { id: 2, name: "Drivers", permissions: ["read", "write"] }
        ]
      },
      {
        id: 2,
        resourceId: 2,
        subjects: [
          { id: 3, name: "User Process 1", permissions: ["read", "execute"] },
          { id: 4, name: "User Process 2", permissions: ["read", "execute"] }
        ]
      },
      {
        id: 3,
        resourceId: 3,
        subjects: [
          { id: 3, name: "User Process 1", permissions: ["read", "write"] },
          { id: 4, name: "User Process 2", permissions: ["read", "write"] }
        ]
      },
      {
        id: 4,
        resourceId: 4,
        subjects: [
          { id: 3, name: "User Process 1", permissions: ["read", "write"] },
          { id: 4, name: "User Process 2", permissions: ["read", "write"] },
          { id: 0, name: "Kernel", permissions: ["read", "write"] }
        ]
      }
    ]
    
    const capabilities = [
      {
        id: 0,
        name: "Kernel Execute",
        permissions: ["execute"],
        holder: 0
      },
      {
        id: 1,
        name: "Kernel ReadWrite",
        permissions: ["read", "write"],
        holder: 0
      },
      {
        id: 2,
        name: "User Execute",
        permissions: ["execute"],
        holder: 3
      },
      {
        id: 3,
        name: "User ReadWrite",
        permissions: ["read", "write"],
        holder: 3
      },
      {
        id: 4,
        name: "Shared Access",
        permissions: ["read", "write"],
        holder: 3
      }
    ]
    
    const pageTables = []
    const pageSize = 4096 // 4KB pages
    const totalPages = Math.ceil(config.memorySize / pageSize)
    
    for (let i = 0; i < totalPages; i++) {
      const virtualAddress = i * pageSize
      const physicalAddress = virtualAddress // Simplified mapping
      
      // Determine permissions based on region
      const permissions = {
        present: true,
        writable: false,
        user: false,
        executable: false,
        accessed: false,
        dirty: false
      }
      
      // Find which region this page belongs to
      const region = memoryRegions.find(r => 
        virtualAddress >= r.base && virtualAddress < r.base + r.size
      )
      
      if (region) {
        permissions.writable = region.permissions.write
        permissions.user = region.permissions.user
        permissions.executable = region.permissions.execute
      }
      
      pageTables.push({
        id: i,
        virtualAddress,
        physicalAddress,
        permissions,
        protected: true,
        violations: 0
      })
    }
    
    const segmentDescriptors = [
      {
        id: 0,
        base: 0x000000,
        limit: 0x100000, // 1MB
        type: "code" as const,
        permissions: {
          present: true,
          writable: false,
          executable: true,
          user: false,
          dpl: 0 // Kernel level
        },
        protected: true,
        violations: 0
      },
      {
        id: 1,
        base: 0x100000,
        limit: 0x100000, // 1MB
        type: "data" as const,
        permissions: {
          present: true,
          writable: true,
          executable: false,
          user: false,
          dpl: 0 // Kernel level
        },
        protected: true,
        violations: 0
      },
      {
        id: 2,
        base: 0x200000,
        limit: 0x200000, // 2MB
        type: "code" as const,
        permissions: {
          present: true,
          writable: false,
          executable: true,
          user: true,
          dpl: 3 // User level
        },
        protected: true,
        violations: 0
      },
      {
        id: 3,
        base: 0x400000,
        limit: 0x400000, // 4MB
        type: "data" as const,
        permissions: {
          present: true,
          writable: true,
          executable: false,
          user: true,
          dpl: 3 // User level
        },
        protected: true,
        violations: 0
      },
      {
        id: 4,
        base: 0x800000,
        limit: 0x200000, // 2MB
        type: "data" as const,
        permissions: {
          present: true,
          writable: true,
          executable: false,
          user: true,
          dpl: 3 // User level
        },
        protected: true,
        violations: 0
      }
    ]
    
    setProtection({
      memoryRegions,
      accessControlLists,
      capabilities,
      pageTables,
      segmentDescriptors,
      statistics: {
        validAccesses: 0,
        invalidAccesses: 0,
        protectionViolations: 0,
        attackSuccesses: 0,
        attackBlocks: 0,
        protectionEffectiveness: 0
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Conceptos de Protección de Memoria</h1>
        <p className="text-gray-600 mt-2">
          Comprende cómo los mecanismos de protección de memoria previenen accesos no autorizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="memorySize">Tamaño de Memoria (bytes)</Label>
              <Input
                id="memorySize"
                type="number"
                value={config.memorySize}
                onChange={(e) => setConfig({...config, memorySize: Number(e.target.value)})}
                min="1048576"
                step="1048576"
              />
            </div>

            <div>
              <Label htmlFor="protectionType">Tipo de Protección</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.protectionType === "paging" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "paging"})}
                >
                  Paginación
                </Button>
                <Button
                  variant={config.protectionType === "segmentation" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "segmentation"})}
                >
                  Segmentación
                </Button>
                <Button
                  variant={config.protectionType === "hybrid" ? "default" : "outline"}
                  onClick={() => setConfig({...config, protectionType: "hybrid"})}
                >
                  Híbrida
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="accessControl">Nivel de Acceso</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.accessControl === "user" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessControl: "user"})}
                >
                  Usuario
                </Button>
                <Button
                  variant={config.accessControl === "kernel" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessControl: "kernel"})}
                >
                  Kernel
                </Button>
                <Button
                  variant={config.accessControl === "supervisor" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessControl: "supervisor"})}
                >
                  Supervisor
                </Button>
                <Button
                  variant={config.accessControl === "hypervisor" ? "default" : "outline"}
                  onClick={() => setConfig({...config, accessControl: "hypervisor"})}
                >
                  Hipervisor
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="permissionModel">Modelo de Permisos</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={config.permissionModel === "rwx" ? "default" : "outline"}
                  onClick={() => setConfig({...config, permissionModel: "rwx"})}
                >
                  RWX
                </Button>
                <Button
                  variant={config.permissionModel === "capabilities" ? "default" : "outline"}
                  onClick={() => setConfig({...config, permissionModel: "capabilities"})}
                >
                  Capabilities
                </Button>
                <Button
                  variant={config.permissionModel === "accessControlList" ? "default" : "outline"}
                  onClick={() => setConfig({...config, permissionModel: "accessControlList"})}
                >
                  ACL
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="attackType">Tipo de Ataque</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={config.attackType === "bufferOverflow" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "bufferOverflow"})}
                >
                  Buffer Overflow
                </Button>
                <Button
                  variant={config.attackType === "useAfterFree" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "useAfterFree"})}
                >
                  Use After Free
                </Button>
                <Button
                  variant={config.attackType === "privilegeEscalation" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "privilegeEscalation"})}
                >
                  Escalada de Privilegios
                </Button>
                <Button
                  variant={config.attackType === "memoryLeak" ? "default" : "outline"}
                  onClick={() => setConfig({...config, attackType: "memoryLeak"})}
                >
                  Memory Leak
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="simulationSpeed">Velocidad de Simulación (ms)</Label>
              <Input
                id="simulationSpeed"
                type="range"
                min="50"
                max="1000"
                value={config.simulationSpeed}
                onChange={(e) => setConfig({...config, simulationSpeed: Number(e.target.value)})}
              />
              <div className="text-center">{config.simulationSpeed} ms</div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={simulateMemoryProtection} 
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? "Simulando..." : "Iniciar Simulación"}
              </Button>
              <Button 
                onClick={resetSimulation} 
                variant="outline"
              >
                Reset
              </Button>
            </div>

            {isRunning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado de Protección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Válidos</div>
                  <div className="text-2xl font-bold text-green-600">{protection.statistics.validAccesses}</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Accesos Inválidos</div>
                  <div className="text-2xl font-bold text-red-600">{protection.statistics.invalidAccesses}</div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Violaciones</div>
                  <div className="text-2xl font-bold text-blue-600">{protection.statistics.protectionViolations}</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded text-center">
                  <div className="text-xs text-gray-500 mb-1">Efectividad</div>
                  <div className="text-2xl font-bold text-purple-600">{protection.statistics.protectionEffectiveness.toFixed(1)}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Ataques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Bloqueados</div>
                          <div className="text-2xl font-bold text-green-600">{protection.statistics.attackBlocks}</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Exitosos</div>
                          <div className="text-2xl font-bold text-red-600">{protection.statistics.attackSuccesses}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tasa de Bloqueo</span>
                          <span>
                            {protection.statistics.attackBlocks + protection.statistics.attackSuccesses > 0 
                              ? ((protection.statistics.attackBlocks / (protection.statistics.attackBlocks + protection.statistics.attackSuccesses)) * 100).toFixed(1)
                              : "0.0"}%
                          </span>
                        </div>
                        <Progress 
                          value={protection.statistics.attackBlocks + protection.statistics.attackSuccesses > 0 
                            ? (protection.statistics.attackBlocks / (protection.statistics.attackBlocks + protection.statistics.attackSuccesses)) * 100
                            : 0} 
                          className="w-full" 
                          color={
                            protection.statistics.attackBlocks + protection.statistics.attackSuccesses > 0 
                              ? (protection.statistics.attackBlocks / (protection.statistics.attackBlocks + protection.statistics.attackSuccesses)) > 0.8 
                                ? "green" 
                                : "yellow"
                              : "gray"
                          }
                        />
                      </div>
                      
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">Tipo de Ataque Actual</div>
                        <div className="font-semibold">
                          {config.attackType === "bufferOverflow" && "Buffer Overflow"}
                          {config.attackType === "useAfterFree" && "Use After Free"}
                          {config.attackType === "privilegeEscalation" && "Escalada de Privilegios"}
                          {config.attackType === "memoryLeak" && "Memory Leak"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mecanismos de Protección</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Tipo</div>
                          <div className="font-semibold">
                            {config.protectionType === "paging" && "Paginación"}
                            {config.protectionType === "segmentation" && "Segmentación"}
                            {config.protectionType === "hybrid" && "Híbrida"}
                          </div>
                        </div>
                        <div className="p-2 bg-green-50 rounded text-center">
                          <div className="text-xs text-gray-500 mb-1">Modelo</div>
                          <div className="font-semibold">
                            {config.permissionModel === "rwx" && "RWX"}
                            {config.permissionModel === "capabilities" && "Capabilities"}
                            {config.permissionModel === "accessControlList" && "ACL"}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Nivel de Acceso</div>
                        <div className="font-semibold">
                          {config.accessControl === "user" && "Usuario"}
                          {config.accessControl === "kernel" && "Kernel"}
                          {config.accessControl === "supervisor" && "Supervisor"}
                          {config.accessControl === "hypervisor" && "Hipervisor"}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Protecciones Activas</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            NX Bit
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            ASLR
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Stack Canary
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            SMEP
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            SMAP
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="font-semibold mb-2">Regiones de Memoria</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {protection.memoryRegions.map(region => (
                    <Card key={region.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">{region.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Dirección Inicio</div>
                              <div className="font-mono text-sm">
                                0x{region.base.toString(16).toUpperCase()}
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-center">
                              <div className="text-xs text-gray-500">Tamaño</div>
                              <div className="font-mono text-sm">
                                {(region.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Permisos</div>
                            <div className="flex flex-wrap gap-1">
                              {region.permissions.read && (
                                <Badge variant="outline" className="text-xs">R</Badge>
                              )}
                              {region.permissions.write && (
                                <Badge variant="outline" className="text-xs">W</Badge>
                              )}
                              {region.permissions.execute && (
                                <Badge variant="outline" className="text-xs">X</Badge>
                              )}
                              {region.permissions.user && (
                                <Badge variant="outline" className="text-xs">U</Badge>
                              )}
                              {region.permissions.kernel && (
                                <Badge variant="outline" className="text-xs">K</Badge>
                              )}
                              {region.permissions.supervisor && (
                                <Badge variant="outline" className="text-xs">S</Badge>
                              )}
                              {region.permissions.hypervisor && (
                                <Badge variant="outline" className="text-xs">H</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Violaciones</span>
                              <span>{region.violations}</span>
                            </div>
                            <Progress 
                              value={region.violations > 0 ? Math.min(region.violations * 10, 100) : 0} 
                              className="w-full" 
                              color={region.violations > 0 ? "red" : "green"}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Último acceso: {region.lastAccess}</span>
                            <span>Protegida: {region.protected ? "Sí" : "No"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">Violaciones Recientes por Región</div>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded">
                  {protection.memoryRegions
                    .filter(r => r.violations > 0)
                    .slice(-30)
                    .map(r => (
                      <div
                        key={r.id}
                        className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono bg-red-500 text-white"
                        title={`${r.name}: ${r.violations} violaciones (último acceso ${r.lastAccess})`}
                      >
                        {r.id % 10}
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tipos de Protección de Memoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800 mb-2">Paginación</div>
              <p className="text-sm text-blue-700 mb-3">
                Divide la memoria en páginas fijas y utiliza tablas de páginas 
                para mapear direcciones virtuales a físicas con permisos.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Simple:</strong> Fácil de implementar en hardware</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Flexible:</strong> Permite mapeo no contiguo</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Eficiente:</strong> Buen uso del espacio de direcciones</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Fragmentación:</strong> Puede dejar huecos en memoria</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded">
              <div className="font-semibold text-green-800 mb-2">Segmentación</div>
              <p className="text-sm text-green-700 mb-3">
                Divide la memoria en segmentos lógicos basados en la estructura 
                del programa con permisos específicos por segmento.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Organización:</strong> Refleja la estructura lógica del programa</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Protección:</strong> Permite permisos por tipo de datos</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Compartición:</strong> Fácil compartir segmentos entre procesos</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Complejidad:</strong> Más difícil de gestionar que paginación</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800 mb-2">Híbrida</div>
              <p className="text-sm text-purple-700 mb-3">
                Combina paginación y segmentación para obtener ventajas de ambos 
                enfoques y superar sus limitaciones individuales.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Mejor organización:</strong> Segmentación lógica con paginación física</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Flexibilidad:</strong> Permite ambas estrategias de protección</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-green-500">✓</span>
                  <span><strong>Optimización:</strong> Mejor uso de recursos de memoria</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <span className="mr-2 text-red-500">✗</span>
                  <span><strong>Complejidad:</strong> Mayor complejidad en implementación</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="font-semibold mb-2">Mecanismos de Protección Adicionales:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3 bg-red-50 rounded text-center">
                <div className="font-semibold text-red-800">NX Bit</div>
                <div className="text-xs text-red-700 mt-1">
                  Previene ejecución en páginas de datos
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded text-center">
                <div className="font-semibold text-yellow-800">ASLR</div>
                <div className="text-xs text-yellow-700 mt-1">
                  Aleatoriza posiciones de memoria
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded text-center">
                <div className="font-semibold text-green-800">Stack Canary</div>
                <div className="text-xs text-green-700 mt-1">
                  Detecta desbordamientos de buffer
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded text-center">
                <div className="font-semibold text-blue-800">SMEP</div>
                <div className="text-xs text-blue-700 mt-1">
                  Prevención de ejecución en modo supervisor
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded text-center">
                <div className="font-semibold text-purple-800">SMAP</div>
                <div className="text-xs text-purple-700 mt-1">
                  Prevención de acceso en modo supervisor
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
