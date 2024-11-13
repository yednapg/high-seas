import type { Ship } from '@/app/utils/data'
import Pill from './pill'

import DoubloonsImage from '/public/doubloon.svg'
import Image from 'next/image'

export default function ShipPillCluster({
  ship,
  shipChains,
}: {
  ship: Ship
  shipChains: Map<string, string[]>
}) {
  const shipUpdates = shipChains
    ? shipChains.get(ship.wakatimeProjectNames.join(','))
    : null
  const shipUpdateCount = shipUpdates ? shipUpdates.length - 1 : null

  return (
    <>
      <Pill msg={`${ship.total_hours?.toFixed(3) ?? 0} hr`} glyph="clock" />

      {ship.shipStatus === 'shipped' &&
        (ship.voteRequirementMet ? (
          ship.doubloonPayout ? (
            <Pill
              msg={`${Math.floor(ship.doubloonPayout)} Doubloons`}
              color="green"
              glyphImage={
                <Image src={DoubloonsImage} alt="doubloons" height={20} />
              }
            />
          ) : (
            <Pill
              msg={`Awaiting ${10 - ship.matchups_count} more vote${
                10 - ship.matchups_count === 1 ? '' : 's'
              } from other pirates…`}
              color="blue"
              glyph="event-add"
              percentage={Math.max(ship.matchups_count * 10, 5)}
            />
          )
        ) : (
          <Pill
            msg={'Pending: Vote to unlock payout!'}
            color="blue"
            glyph="enter"
          />
        ))}

      {shipUpdateCount && shipUpdateCount > 0 ? (
        <Pill
          msg={`${shipUpdateCount} Ship update${
            shipUpdateCount === 1 ? '' : 's'
          }`}
          color="purple"
          glyph="reply"
          glyphStyles={{ transform: 'scaleX(-1)' }}
        />
      ) : null}
    </>
  )
}
