import React from 'react';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/apis';
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
} from 'react-icons/fa';

const LanguagesNav = ({ selected, onUpdateLanguage }) => {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

  return (
    <ul className='flex-center'>
      {languages.map((language) => (
        <li key={language}>
          <button
            className='btn-clear nav-link'
            style={language === selected ? { color: 'rgb(187, 46, 31)' } : null}
            onClick={() => onUpdateLanguage(language)}
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
};

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired,
  repo: PropTypes.string,
};

const ReposGrid = ({ repos }) => {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues,
        } = repo;
        const { login, avatar_url } = owner;

        return (
          <li key={html_url} className='card bg-light'>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              name={login}
              href={html_url}
            >
              <ul className='card-list'>
                <li>
                  <Tooltip text={`Github Username`}>
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color='rgb(255, 215, 0)' size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                  {open_issues.toLocaleString()} open issues
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
};

export default class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null,
  };

  componentDidMount() {
    const { selectedLanguage } = this.state;
    this.updateLanguage(selectedLanguage);
  }

  updateLanguage = (selectedLanguage) => {
    const { repos } = this.state;
    this.setState({ selectedLanguage, error: null });

    if (!repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then((data) =>
          this.setState(({ repos }) => ({
            repos: { ...repos, [selectedLanguage]: data },
          }))
        )
        .catch((error) => {
          console.warn(
            'there is an error occurring while trying to fecth data'
          );
          this.setState({ error });
        });
    }
  };

  isLoading = () => {
    const { selectedLanguage, repos, error } = this.state;
    return !repos[selectedLanguage] && error === null;
  };

  render() {
    const { selectedLanguage, repos, error } = this.state;
    return (
      <>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdateLanguage={this.updateLanguage}
        />
        {this.isLoading() && <Loading text={'Fetching Repos'} />}
        {repos[selectedLanguage] && (
          <ReposGrid repos={repos[selectedLanguage]} />
        )}
        {error && <p className='center-text error'>{error}</p>}
      </>
    );
  }
}
