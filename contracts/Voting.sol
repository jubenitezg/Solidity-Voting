// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Voting {
    uint private timeStart;
    uint private timeEnd;
    string[] private candidates;
    mapping(string => uint) private candidateVotes;
    mapping(address => bool) private hasVoted;

    constructor(uint _timeStart, uint _timeEnd, string[] memory _candidates) {
        timeStart = _timeStart;
        timeEnd = _timeEnd;
        candidates = _candidates;
    }

    modifier votingPeriod() {
        require(
            block.timestamp >= timeStart && block.timestamp <= timeEnd,
            "Voting is only not allowed at this time."
        );
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted.");
        _;
    }

    function vote(string memory candidate) public votingPeriod hasNotVoted {
        candidateVotes[candidate] += 1;
        hasVoted[msg.sender] = true;
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }

    function getTimeStart() public view returns (uint) {
        return timeStart;
    }

    function getTimeEnd() public view returns (uint) {
        return timeEnd;
    }

    function getVoteCount(string memory candidate) public view returns (uint) {
        return candidateVotes[candidate];
    }

    function getWinner() public view returns (string memory) {
        require(block.timestamp > timeEnd, "Voting is still ongoing.");
        uint maxVotes = 0;
        string memory winner;
        for (uint i = 0; i < candidates.length; i++) {
            if (getVoteCount(candidates[i]) > maxVotes) {
                maxVotes = candidateVotes[candidates[i]];
                winner = candidates[i];
            }
        }
        return winner;
    }
}
