'use client'

import { useState, useEffect } from 'react'

interface Choice {
  text: string
  next: string
}

interface Scene {
  id: string
  text: string
  choices?: Choice[]
  ending?: boolean
}

const scenes: Record<string, Scene> = {
  intro: {
    id: 'intro',
    text: `A large passenger plane is taking off into the sky. Suddenly the engine bursts with smoke and fire, and the aircraft spirals down uncontrollably.

The plane crashes violently onto the ground.

From the burning wreckage, three survivors emerge:

• **Sarah Chen** - A former army medic, resourceful and calm under pressure
• **Marcus Webb** - A software engineer with survival training as a hobby
• **Elena Rodriguez** - A commercial pilot, injured but determined

The wreckage is scattered across a remote forest. Flames consume what remains of the fuselage. You must act quickly.`,
    choices: [
      { text: 'Search the wreckage for supplies before it\'s consumed by fire', next: 'search_wreckage' },
      { text: 'Move away from the crash site and find shelter', next: 'find_shelter' },
      { text: 'Tend to Elena\'s injuries first', next: 'treat_injuries' }
    ]
  },

  search_wreckage: {
    id: 'search_wreckage',
    text: `Marcus and Sarah rush back toward the burning wreckage. The heat is intense, and fuel fumes make breathing difficult.

They manage to retrieve:
- A first aid kit
- Two bottles of water
- A survival blanket
- A small fire extinguisher

As they retreat, a secondary explosion rocks the plane. They barely escape in time.

Elena calls out: "We need to move! That smoke will be visible for miles, but so will any rescue teams."`,
    choices: [
      { text: 'Stay near the crash site to be found by rescuers', next: 'stay_crash' },
      { text: 'Head toward higher ground for better visibility', next: 'higher_ground' },
      { text: 'Find water source - survival priority', next: 'find_water' }
    ]
  },

  find_shelter: {
    id: 'find_shelter',
    text: `The group moves quickly away from the inferno. Sarah supports Elena as they navigate through dense forest.

Marcus spots an outcropping of rocks about half a mile away - natural shelter from the elements.

As night falls, they huddle together. Elena's breathing is labored. Without medical supplies, her condition could worsen.

In the distance, they hear something. Engines? Or animals?`,
    choices: [
      { text: 'Investigate the sound - could be rescue', next: 'investigate_sound' },
      { text: 'Stay hidden and observe', next: 'stay_hidden' },
      { text: 'Start a signal fire', next: 'signal_fire' }
    ]
  },

  treat_injuries: {
    id: 'treat_injuries',
    text: `Sarah immediately assesses Elena's injuries: fractured ribs, possible concussion, lacerations on her left arm.

"I need supplies," Sarah says urgently. "The first aid kit should be in the rear galley compartment."

Marcus volunteers to brave the flames one more time.

He returns with the kit but is severely burned on his hands. Now you have two injured survivors.

Elena stabilizes, but Marcus is in pain. The group's mobility is compromised.`,
    choices: [
      { text: 'Create a visible SOS signal and wait for rescue', next: 'sos_wait' },
      { text: 'Sarah scouts ahead alone while others rest', next: 'sarah_scouts' },
      { text: 'All move together slowly toward any signs of civilization', next: 'move_together' }
    ]
  },

  stay_crash: {
    id: 'stay_crash',
    text: `The group decides to remain near the crash site. They set up camp using debris as shelter and create a large SOS pattern using wreckage.

Day 1: No sign of rescue. They ration the water carefully.

Day 2: A helicopter passes overhead but doesn't seem to spot them. The smoke has cleared.

Day 3: Water is gone. Elena's condition worsens. They must make a decision.`,
    choices: [
      { text: 'One person treks for help while others wait', next: 'one_leaves' },
      { text: 'All leave together before too weak', next: 'all_leave' }
    ]
  },

  higher_ground: {
    id: 'higher_ground',
    text: `The climb is exhausting, but by afternoon they reach a ridge with a panoramic view.

Below: dense forest stretching for miles.

In the distance: what might be a road, or a river? It's hard to tell.

More importantly, they spot a small cabin about 2 miles northeast.

The sun is setting. They could reach the cabin by nightfall if they move quickly, but navigating in darkness would be dangerous.`,
    choices: [
      { text: 'Push through to reach the cabin tonight', next: 'reach_cabin' },
      { text: 'Camp here and move at first light', next: 'camp_ridge' }
    ]
  },

  find_water: {
    id: 'find_water',
    text: `Marcus remembers his survival training: follow the terrain downward, listen for running water.

After an hour of searching, they find a stream. The water is clear and cold.

Sarah insists on boiling it first if possible. They have a metal container from the wreckage.

While setting up to purify water, Elena notices something: boot prints in the mud. Fresh. Leading upstream.`,
    choices: [
      { text: 'Follow the boot prints - means people nearby', next: 'follow_prints' },
      { text: 'Avoid whoever made them - could be dangerous', next: 'avoid_people' }
    ]
  },

  investigate_sound: {
    id: 'investigate_sound',
    text: `Marcus moves cautiously toward the sound. The others wait tensely.

He returns fifteen minutes later, eyes wide: "You're not going to believe this. There's a ranger station, maybe a quarter mile from here. Lights are on."

Hope surges through the group.

But Marcus looks concerned: "I saw someone, but they were moving strangely. And I heard shouting. Something's not right."`,
    choices: [
      { text: 'Approach the ranger station carefully', next: 'ranger_station' },
      { text: 'Bypass it and keep moving', next: 'bypass_station' }
    ]
  },

  stay_hidden: {
    id: 'stay_hidden',
    text: `The group remains silent, watching through the trees.

Two figures emerge in the distance. They're not in uniform. They're carrying tools and lights, searching methodically.

One speaks into a radio: "No survivors visible yet. Keep searching the perimeter."

Sarah whispers: "Those aren't rescue workers. They're looking for something specific."

The figures move closer to your position.`,
    choices: [
      { text: 'Reveal yourselves - might be help', next: 'reveal_selves' },
      { text: 'Slip away quietly in opposite direction', next: 'slip_away' }
    ]
  },

  signal_fire: {
    id: 'signal_fire',
    text: `Using the survival blanket and Marcus's lighter, they create a signal fire on a small clearing.

The smoke rises high into the night sky.

Two hours later: the sound of engines grows louder. Definitely vehicles.

Multiple headlights appear through the trees.

But as they get closer, Elena realizes something: "Those aren't rescue vehicles. That's military transport."

The vehicles stop. Armed personnel begin deploying.`,
    choices: [
      { text: 'Flag them down - military can help', next: 'military_help' },
      { text: 'Hide and observe their intentions', next: 'observe_military' }
    ]
  },

  reach_cabin: {
    id: 'reach_cabin',
    text: `Racing against darkness, the group stumbles through the forest.

They reach the cabin just as the last light fades. It's small, weathered, but intact.

The door is unlocked. Inside: canned food, a wood stove, beds with dusty blankets.

A calendar on the wall shows a date from three years ago.

Marcus finds a hand-crank radio. He begins turning the dial, searching for signals.

Suddenly, a voice crackles through: "...Flight 447... all passengers presumed lost... continue search operations..."

They're officially dead. No one is looking for survivors.`,
    choices: [
      { text: 'Use the radio to broadcast your position', next: 'broadcast_position' },
      { text: 'Stay quiet and recover strength first', next: 'recover_strength' }
    ]
  },

  follow_prints: {
    id: 'follow_prints',
    text: `The boot prints lead upstream for about a mile.

The group rounds a bend and finds: a small homesteader's camp. Solar panels, a water purification system, raised gardens.

An older man sits on a porch, rifle across his lap. He's watching you.

"Saw the smoke yesterday," he says. "Figured someone might come through. You from that plane?"

Sarah nods cautiously.

The man stands. "Name's Clayton. You folks look like hell. Got medical supplies inside. Food too."

He pauses. "But you should know - I got a radio call this morning. They said there were no survivors. They called off the search."

Something in his tone suggests he knows more than he's saying.`,
    choices: [
      { text: 'Accept Clayton\'s help', next: 'accept_help' },
      { text: 'Thank him but move on', next: 'decline_help' }
    ]
  },

  ranger_station: {
    id: 'ranger_station',
    text: `The group approaches the ranger station carefully.

The door is ajar. Inside: signs of a struggle. Overturned furniture. A radio sparking on the floor.

A ranger sits in the corner, injured but alive.

"Don't... trust them..." he gasps. "The crash wasn't... an accident."

He hands Sarah a small data drive. "Evidence. Get this out. They're coming back."

In the distance: vehicles approaching.`,
    choices: [
      { text: 'Take the evidence and run', next: 'take_evidence' },
      { text: 'Stay and help the ranger', next: 'help_ranger' }
    ]
  },

  accept_help: {
    id: 'accept_help',
    text: `Clayton proves to be a gracious host. He treats Elena's injuries properly, feeds the group, and lets them rest.

That night, around a fire, he reveals his story:

"I used to work for the NTSB - National Transportation Safety Board. Investigated crashes. Twenty years. Then I found something I wasn't supposed to find."

He looks at them seriously.

"That plane you were on? It was supposed to go down. Someone wanted it to crash. And they're going to make sure there are no survivors to tell otherwise."

He produces a satellite phone. "I can get you out. But you need to decide: do you want to disappear and stay safe, or do you want to fight back and expose what happened?"`,
    choices: [
      { text: 'Disappear and stay alive', next: 'disappear_ending' },
      { text: 'Fight back and expose the truth', next: 'fight_ending' }
    ]
  },

  take_evidence: {
    id: 'take_evidence',
    text: `Sarah grabs the data drive. "We have to go. Now!"

The group runs into the forest as vehicles arrive at the station.

Over the next week, they navigate through wilderness, evading search parties, until they reach a small town.

Using Clayton's contacts (the ranger had his information), they get the data to investigative journalists.

The evidence reveals a conspiracy: the plane was sabotaged to eliminate a whistleblower on board who was about to expose corporate fraud worth billions.

Within a month, arrests are made. The truth comes out.

The three survivors testify. Justice is served.

But they'll never forget those who didn't make it out.`,
    ending: true
  },

  disappear_ending: {
    id: 'disappear_ending',
    text: `Clayton makes arrangements. Within 48 hours, the three survivors are on a boat heading to a remote coastal community under new identities.

They start new lives far from everything they knew.

Sarah opens a clinic. Marcus teaches at a local school. Elena eventually learns to fly small planes again.

They never speak about the crash publicly. Officially, they're dead.

But they're alive. They're safe. And they're together.

Sometimes that's enough.

**THE END - Path of Safety**`,
    ending: true
  },

  fight_ending: {
    id: 'fight_ending',
    text: `With Clayton's help, the survivors compile evidence and reach out to investigative journalists.

The conspiracy goes deep: a CEO sabotaged the plane to eliminate a whistleblower traveling to testify about massive fraud.

The survivors become key witnesses in a trial that captivates the world.

It takes two years, but justice prevails. Arrests are made. The company collapses. New safety regulations are implemented.

Sarah, Marcus, and Elena become advocates for aviation safety and corporate accountability.

They honor the memory of those who didn't survive by ensuring their deaths meant something.

They transform tragedy into purpose.

**THE END - Path of Justice**`,
    ending: true
  },

  broadcast_position: {
    id: 'broadcast_position',
    text: `Marcus broadcasts on multiple frequencies: "This is survivor from Flight 447. Three alive. Requesting assistance. Coordinates..."

Within hours, they hear helicopters.

But when the rescue team arrives, something is wrong. The team leader's eyes are cold.

"We'll take it from here," he says, and his team begins surrounding them.

Elena whispers: "They're not here to rescue us."

Too late, they realize: someone wanted that plane to crash. And they want no witnesses.

The survivors fight back desperately, but they're outnumbered and exhausted.

In the chaos, Marcus manages to send one final radio message before everything goes dark.

That message eventually reaches the right people. The truth comes out. But it's too late for the three survivors.

**THE END - Pyrrhic Truth**`,
    ending: true
  },

  slip_away: {
    id: 'slip_away',
    text: `The group moves silently away from the mysterious searchers.

Over the next several days, they survive on instinct, avoiding detection, until they finally reach a highway.

A truck driver picks them up and takes them to the nearest town.

At the hospital, they learn the truth: the plane was sabotaged. A whistleblower on board was the target. But the conspirators failed - not everyone died.

With protection from federal authorities, the survivors testify. The conspiracy unravels.

Years later, they reunite annually at a memorial for those who didn't make it.

They survived together. They exposed the truth. They honored the fallen.

**THE END - Silent Justice**`,
    ending: true
  },

  // Additional abbreviated endings for remaining paths

  sos_wait: {
    id: 'sos_wait',
    text: `The group waits near the crash site, maintaining their SOS signal.

On day 4, a civilian helicopter spots them. The pilot, a independent contractor, wasn't part of the official search.

He lands and evacuates all three survivors.

At the hospital, they learn their rescue was extraordinary luck. The official search had been called off.

They recover, and though they never learn why the crash happened, they're grateful to be alive.

**THE END - Lucky Survival**`,
    ending: true
  },

  sarah_scouts: {
    id: 'sarah_scouts',
    text: `Sarah scouts ahead and finds a logging road. She flags down a truck.

The driver takes her to the nearest ranger station, and rescue teams are dispatched.

Marcus and Elena are evacuated within hours.

All three survive and eventually recover.

An investigation reveals the crash was caused by mechanical failure, not sabotage.

They start a foundation to support crash survivors and their families.

**THE END - Road to Recovery**`,
    ending: true
  },

  move_together: {
    id: 'move_together',
    text: `Moving slowly but together, the group follows a creek downstream.

After three days, they reach a small settlement.

The locals provide medical care and contact authorities.

The survivors recover and eventually return to their lives, forever bonded by their shared experience.

**THE END - Strength in Unity**`,
    ending: true
  },

  one_leaves: {
    id: 'one_leaves',
    text: `Marcus volunteers to go for help. He promises to send rescue within 48 hours.

Sarah and Elena wait.

72 hours pass. No Marcus. No rescue.

They realize they must move or die.

Summoning their last strength, they begin walking.

On the fifth day, dehydrated and near collapse, they stumble onto a forest service road.

A ranger finds them and calls for medical evacuation.

Marcus is found three days later. He had gotten lost but survived.

All three eventually recover.

**THE END - Separated but Alive**`,
    ending: true
  },

  all_leave: {
    id: 'all_leave',
    text: `Together, the three survivors leave the crash site.

Following the terrain downward, they eventually find a stream, then a trail, then a road.

After six grueling days, they reach civilization.

Medics are amazed they all survived.

The investigation reveals the crash was due to a maintenance error.

The survivors become advocates for better airline safety standards.

**THE END - Against All Odds**`,
    ending: true
  },

  camp_ridge: {
    id: 'camp_ridge',
    text: `They camp on the ridge overnight.

At dawn, they move toward the cabin they spotted.

They find it's a ranger outpost - abandoned but stocked with supplies and a working radio.

They call for help and are rescued within hours.

All three survive and eventually recover fully.

**THE END - Patient Wisdom**`,
    ending: true
  },

  avoid_people: {
    id: 'avoid_people',
    text: `The group avoids the mysterious boot prints and heads downstream.

After four days, they reach a small town.

They learn the boot prints belonged to poachers who were avoiding authorities themselves.

The survivors recover in the hospital and return to their lives.

**THE END - Cautious Survival**`,
    ending: true
  },

  bypass_station: {
    id: 'bypass_station',
    text: `The group bypasses the ranger station.

They continue through the wilderness for three more days before finding a highway.

A passing motorist picks them up and takes them to the hospital.

They learn the ranger station had been abandoned and the "shouting" was an old TV left running.

**THE END - Safe Passage**`,
    ending: true
  },

  reveal_selves: {
    id: 'reveal_selves',
    text: `They reveal themselves to the searchers.

The figures turn out to be private search and rescue contractors hired by the airline.

They provide immediate medical care and evacuation.

All three survivors recover.

**THE END - Unexpected Allies**`,
    ending: true
  },

  military_help: {
    id: 'military_help',
    text: `They flag down the military personnel.

The soldiers provide immediate assistance. They were conducting unrelated exercises when they saw the crash.

All three survivors are evacuated and receive medical treatment.

They recover and return to their lives.

**THE END - Military Rescue**`,
    ending: true
  },

  observe_military: {
    id: 'observe_military',
    text: `From hiding, they watch the military team.

The soldiers are clearly searching for survivors to help them.

When it's clear they're friendly, the group reveals themselves.

They're rescued and recover fully.

**THE END - Cautious Trust**`,
    ending: true
  },

  recover_strength: {
    id: 'recover_strength',
    text: `They stay quiet in the cabin for a week, recovering strength.

Once healthy, they hike out and reach a town.

They learn the search had been called off, but they're alive.

They return to their lives forever changed.

**THE END - Quiet Recovery**`,
    ending: true
  },

  decline_help: {
    id: 'decline_help',
    text: `They thank Clayton but move on, not fully trusting the situation.

After several more days, they reach civilization on their own.

They learn Clayton was genuine but respect their choice.

All three recover.

**THE END - Self-Reliance**`,
    ending: true
  },

  help_ranger: {
    id: 'help_ranger',
    text: `They stay to help the ranger.

When the vehicles arrive, they turn out to be actual rescue teams.

The ranger survives, and his "conspiracy" was actually delirious rambling from his injury.

All recover safely.

**THE END - Compassionate Choice**`,
    ending: true
  }
}

export default function Home() {
  const [currentScene, setCurrentScene] = useState<Scene>(scenes.intro)
  const [history, setHistory] = useState<string[]>(['intro'])
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    setFadeIn(false)
    const timer = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(timer)
  }, [currentScene])

  const makeChoice = (nextSceneId: string) => {
    const nextScene = scenes[nextSceneId]
    if (nextScene) {
      setCurrentScene(nextScene)
      setHistory([...history, nextSceneId])
    }
  }

  const restart = () => {
    setCurrentScene(scenes.intro)
    setHistory(['intro'])
  }

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      const previousSceneId = newHistory[newHistory.length - 1]
      setCurrentScene(scenes[previousSceneId])
      setHistory(newHistory)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        <h1 style={{
          color: '#ff6b6b',
          fontSize: '2.5rem',
          marginBottom: '30px',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          fontWeight: 'bold'
        }}>
          Three Survivors
        </h1>

        <div style={{
          color: '#e0e0e0',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          marginBottom: '40px',
          whiteSpace: 'pre-wrap'
        }}>
          {currentScene.text}
        </div>

        {currentScene.ending ? (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={restart}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              Start New Story
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentScene.choices?.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => makeChoice(choice.next)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    padding: '18px 25px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.borderColor = '#ff6b6b'
                    e.currentTarget.style.transform = 'translateX(10px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  → {choice.text}
                </button>
              ))}
            </div>

            {history.length > 1 && (
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                  onClick={goBack}
                  style={{
                    background: 'transparent',
                    color: '#888',
                    border: '1px solid #555',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#888'
                    e.currentTarget.style.borderColor = '#555'
                  }}
                >
                  ← Go Back
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
