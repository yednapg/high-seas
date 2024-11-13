'use client'

import { SignpostFeedItem } from '@/app/utils/data'
import JaggedCardSmall from '@/components/jagged-card-small'
import Cookies from 'js-cookie'
import Markdown from 'react-markdown'

export default function FeedItems() {
  const cookie = Cookies.get('signpost-feed')
  if (!cookie) return null

  let feedItems: SignpostFeedItem[]
  try {
    feedItems = JSON.parse(cookie).sort((a, b) => a?.autonumber < b?.autonumber)
  } catch (e) {
    console.error("Could't parse signpost feed cookie into JSON:", e)
    return null
  }

  if (!feedItems || feedItems.length === 0) {
    return <p>No feed updates yet! Check back soon.</p>
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
