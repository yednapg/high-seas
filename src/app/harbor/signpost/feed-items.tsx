'use client'

import { fetchSignpostFeed, SignpostFeedItem } from '@/app/utils/data'
import JaggedCardSmall from '@/components/jagged-card-small'
import { useEffect } from 'react'
import Markdown from 'react-markdown'
import useLocalStorageState from '../../../../lib/useLocalStorageState'

export default function FeedItems() {

  const [feedItems, setFeedItems] = useLocalStorageState<SignpostFeedItem[]>([])

  useEffect(() => {
    fetchSignpostFeed().then(r => setFeedItems(r))
  }, [])

  if (!feedItems || feedItems.length === 0) {
    return <p>No feed updates yet! Check back soon.</p>
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {feedItems.map((item, idx) => {
        return (
          <JaggedCardSmall key={idx} bgColor={`#${item.backgroundColor}`}>
            <p style={{ color: `#${item.textColor}` }}>
              <span className="text-xl">
                {item.title}
                <span
                  className={`ml-4 px-1.5 py-0.5 rounded-full text-sm bg-white/20`}
                >
                  {item.category}
                </span>
              </span>
              <br />
              <span style={{ color: `#${item.textColor}` }}>
                <Markdown>{item.content}</Markdown>
              </span>
            </p>
          </JaggedCardSmall>
        )
      })}
    </div>
  )
}
