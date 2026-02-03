export const radioSchedule = [
    { dayIndex: 1, dayName: 'Δευτέρα', events: [{ time: '10:00', title: 'Start Week Script', dj: 'AutoDJ' }, { time: '21:00', title: 'Introduction to Panic (ΠΛΗ10)', dj: 'Nick' }] },
    { dayIndex: 2, dayName: 'Τρίτη', events: [{ time: '18:00', title: 'Coffee Break Beats', dj: 'AutoDJ' }, { time: '22:00', title: 'Algorithm Blues', dj: 'Maria' }] },
    { dayIndex: 3, dayName: 'Τετάρτη', events: [{ time: '20:00', title: 'Mid-Week Crisis', dj: 'Kostas' }] },
    { dayIndex: 4, dayName: 'Πέμπτη', events: [{ time: '12:00', title: 'Study With Me (Lofi)', dj: 'AutoDJ' }] },
    { dayIndex: 5, dayName: 'Παρασκευή', events: [{ time: '23:00', title: 'Friday Night Compile', dj: 'The Team' }] },
    { dayIndex: 6, dayName: 'Σάββατο', events: [{ time: '00:00', title: '404 Sleep Not Found', dj: 'All Star' }] },
    { dayIndex: 0, dayName: 'Κυριακή', events: [{ time: '10:00', title: 'Deadline Evensong', dj: 'The Compiler' }] },
];

export function getUpcomingShow() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Flatten all events and calculate their absolute minutes from the start of the week
    const allEvents = radioSchedule.flatMap(day =>
        day.events.map(event => {
            const [hours, minutes] = event.time.split(':').map(Number);
            let timeInWeek = day.dayIndex * 24 * 60 + hours * 60 + minutes;
            return { ...event, timeInWeek };
        })
    );

    // Sort events by time in week
    allEvents.sort((a, b) => a.timeInWeek - b.timeInWeek);

    // Current time in week
    const currentTimeInWeek = currentDay * 24 * 60 + currentTime;

    // Find the next event
    let nextEvent = allEvents.find(event => event.timeInWeek > currentTimeInWeek);

    // If no more events this week, the first event of the week is the next one
    if (!nextEvent) {
        nextEvent = allEvents[0];
    }

    return nextEvent;
}
