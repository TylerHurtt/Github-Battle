import React from 'react';
import { battle } from '../utils/apis';
import Card from './Card';
import Loading from './Loading';
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaCode,
  FaUser,
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

function ProfileList({ profile }) {
  return (
    <ul className='card-list'>
      <li>
        <FaUser color='rgb(239, 115, 115)' size={22} />
        {profile.name}
      </li>
      {profile.location && (
        <li>
          <Tooltip text={`User's Location`}>
            <FaCompass color='rgb(144, 115, 255)' size={22} />
            {profile.location}
          </Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text={`User's Company`}>
            <FaBriefcase color='#795548' size={22} />
            {profile.company}
          </Tooltip>
        </li>
      )}
      <li>
        <FaUsers color='rgb(129, 195, 245)' size={22} />
        {profile.followers.toLocaleString()} followers
      </li>
      <li>
        <FaUserFriends color='rgb(64, 183, 95)' size={22} />
        {profile.following.toLocaleString()} following
      </li>
    </ul>
  );
}

export default class Results extends React.Component {
  state = {
    winner: null,
    loser: null,
    error: null,
    loading: true,
  };

  componentDidMount() {
    const { playerOne, playerTwo } = queryString.parse(
      this.props.location.search
    );

    battle([playerOne, playerTwo])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loading: false,
        });
      })
      .catch(({ message }) => {
        this.setState({
          error: message,
          loading: false,
        });
      });
  }

  render() {
    const { winner, loser, error, loading } = this.state;

    if (loading === true) {
      return <Loading />;
    }

    if (error) {
      return <p className='center-text error'>{error}</p>;
    }

    return (
      <>
        <div className='grid space-around container-sm'>
          <div className='card bg-light'>
            <Card
              header={winner.score === loser.score ? 'Tie' : 'Winner'}
              avatar={winner.profile.avatar_url}
              name={winner.profile.login}
              subheader={winner.score.toLocaleString()}
              href={winner.profile.html_url}
            >
              <ProfileList profile={winner.profile} />
            </Card>
          </div>
          <div className='card bg-light'>
            <Card
              header={winner.score === loser.score ? 'Tie' : 'Loser'}
              avatar={loser.profile.avatar_url}
              name={loser.profile.login}
              subheader={loser.score.toLocaleString()}
              href={loser.profile.html_url}
            >
              <ProfileList profile={loser.profile} />
            </Card>
          </div>
        </div>
        <Link className='btn dark-btn btn-space' to='/'>
          Reset
        </Link>
      </>
    );
  }
}
