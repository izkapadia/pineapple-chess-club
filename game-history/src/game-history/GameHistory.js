import fsExtra from 'fs-extra'
import fs from 'fs'
import fetch from 'node-fetch'


const root_dir = `${__dirname}/../..`
const outputFolder = `${root_dir}/member-game-history`

const clubName = "pineapple-chess-club"
const MEMBER_URL = `https://api.chess.com/pub/club/${clubName}/members`
const GAME_HISTORY_URL = (username, period) => `https://api.chess.com/pub/player/${username}/games/${period}/pgn`

const createOutputFolder = () => {
    if (fs.existsSync(outputFolder)) {
        fsExtra.emptyDirSync(outputFolder);

    } else {
        fs.mkdirSync(outputFolder)
    }
}

const getFromWeb = async (url, jsonResponse = true) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    if (jsonResponse) {
        return await response.json();
    } else {
        return await response.text();
    }
}

const getUsernames = async () => {

    let response = await getFromWeb(MEMBER_URL);

    let usernames = new Set();
    Object.values(response).forEach(periodData => {
        periodData.forEach(memberData => {
            usernames.add(memberData.username)
        })
    })

    return Array.from(usernames)
}

const getMembersHistory = async () => {
    createOutputFolder();

    let usernames = await getUsernames();
    let periods = [
        '2020/04',
        '2020/05',
        '2020/06'
    ]

    for (var i = 0; i < usernames.length; i++) {
        let username = usernames[i]
        for (var j = 0; j < periods.length; j++) {
            let period = periods[j]
            let url = GAME_HISTORY_URL(username, period)
            let periodGameHistory = await getFromWeb(url, false);

            let filename = `${outputFolder}/${username}-${period.replace("/", "")}`

            console.log(`Save history of user ${username} for period ${period} to file ${filename}`);

            fs.writeFileSync(filename, periodGameHistory)
        }
    }

    
}

export default {
    getMembersHistory
}