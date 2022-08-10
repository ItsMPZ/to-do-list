import styled from 'styled-components'

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  display: grid;
  grid-template-rows: 5.8rem auto;
  box-shadow: var(--shadow-2);

  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    height: 5.8rem;
    h5 {
      letter-spacing: 0;
    }
    button {
      grid-column: 3;
      border: none;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: red;
      cursor: pointer;

    }
    .btn-done{
      background-color: green;
    }
  }
  
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--borderRadius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    margin-right: 2rem;
  }
  .info {
    h5 {
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      color: var(--grey-400);
      letter-spacing: var(--letterSpacing);
    }
  }
  .pending {
    background: #fcefc7;
    color: #e9b949;
  }
  .interview {
    background: #e0e8f9;
    color: #647acb;
  }
  .declined {
    color: #d66a6a;
    background: #ffeeee;
  }
  .done {
    color: var(--my-green);
    background: var(--my-bcg-green);
  }
  .notDone {
    color: #d66a6a;
    background: #ffeeee;
  }
  .content {
    padding: 1rem 1.5rem;
    display: grid;
    grid-template-rows: auto 46px;
  }
  .content-center {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
    p {
      grid-column: 1 / -1;
      min-height: 2rem;
      letter-spacing: var(--letterSpacing);
      span {
        color: var(--grey-400);
      }
    }
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 40px auto;
    }
    @media (min-width: 992px) {
      grid-template-columns: 1fr;
      grid-template-rows: 40px 40px auto;

    }
    @media (min-width: 1120px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 40px auto;
    }
  }

  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    width: 100px;
    height: 30px;
    margin-top: 10px;
  }
  footer {
    margin-top: 1rem;
  }
  .actions {
    display: flex;
    grid-row-end: -1;
  }
  .end {
    margin-left: auto;
  }
  .edit-btn,
  .delete-btn,
  .toogle-btn {
    letter-spacing: var(--letterSpacing);
    cursor: pointer;
    height: 30px;
  }
  .edit-btn {
    color: var(--green-dark);
    background: var(--green-light);
    margin-right: 0.5rem;
  }
  .delete-btn {
    color: var(--red-dark);
    background: var(--red-light);
  }
  .toogle-btn {
    color: #4a510f;
    background: #e7e7d1;
  }
  &:hover .actions {
    visibility: visible;
  }
`

export default Wrapper
