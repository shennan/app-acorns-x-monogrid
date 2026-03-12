import { motion } from 'framer-motion'
import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'

export interface StaggeredChildrenProps extends PropsWithChildren {
  delay?: number
  stagger?: number
  itemAnimationDuration?: number
  className?: string
  direction?: 'down'|'left'|'right'|'up'
  distance?: number
}

const StaggeredChildren = ({ children, className, delay = 100, stagger = 100, itemAnimationDuration = 400, direction = 'down', distance = 300 }: StaggeredChildrenProps) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay / 1000,
        staggerChildren: stagger / 1000
      }
    }
  }

  const itemVariants = {
    hidden: {
      ...(['left', 'right'].includes(direction) ? { x: distance * (direction === 'right' ? -1 : 1) } : {}),
      ...(['up', 'down'].includes(direction) ? { y: distance * (direction === 'down' ? -1 : 1) } : {}),
      opacity: 0
    },
    visible: {
      ...(['left', 'right'].includes(direction) ? { x: 0 } : {}),
      ...(['up', 'down'].includes(direction) ? { y: 0 } : {}),
      opacity: 1,
      transition: {
        duration: itemAnimationDuration / 1000
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={classNames('StaggeredChildren', className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={`StaggeredChildren--${index}`} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default StaggeredChildren
