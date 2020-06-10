import GameHistory from '../game-history/GameHistory'


describe("GameHistoryTest", async () => {
    test("GameHistoryTest-func", async () => {
        await GameHistory.getMembersHistory()
    }, 500 * 1000);

});
