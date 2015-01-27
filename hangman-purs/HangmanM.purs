module HangmanM where

import Control.Monad.State
import Control.Monad.State.Class
import Data.Array
import Data.Char

type Solution = [Char]
type Guesses  = [Char]
data Game     = Game { solution :: Solution
                     , guesses  :: Guesses
                     }
type Hangman  = State Game

data Result = AlreadyGuessed
            | Hit
            | Miss
            | Win
            | Loss

initialState :: Solution -> Game
initialState s = Game { solution : s
                      , guesses  : []
                      }

guess :: Char -> Hangman Result
guess c = do
  result <- check c
  case result of
    Miss -> do
      Game { solution = ss, guesses = gs } <- get
      put $ Game { solution : ss, guesses : gs `snoc` c }
      failed <- checkForFailure
      if failed
        then return Loss
        else return result

    Hit -> do
      Game { solution = ss, guesses = gs } <- get
      put $ Game { solution : ss, guesses : gs `snoc` c }
      solved <- checkForSolved
      if solved
        then return Win
        else return result

    _ -> return result

check :: Char -> Hangman Result
check c = do
  Game { guesses = g } <- get
  if c `elem` g
    then return AlreadyGuessed
    else hitOrMiss c

checkForSolved :: Hangman Boolean
checkForSolved = do
  Game { guesses = gs, solution = ss } <- get
  return $ ss == filter (hits gs) ss
  where
    hits :: Guesses -> Char -> Boolean
    hits gs' c = c `elem` gs'

checkForFailure :: Hangman Boolean
checkForFailure = do
  ms <- misses
  return $ length ms >= 5

misses :: Hangman [Char]
misses = do
  Game { guesses = gs, solution = ss } <- get
  return $ filter (missed ss) gs
  where
    missed :: Solution -> Char -> Boolean
    missed ss c = not $ c `elem` ss

hitOrMiss :: Char -> Hangman Result
hitOrMiss c = do
  Game { solution = s } <- get
  if c `elem` s
    then return Hit
    else return Miss

elem :: forall a. (Eq a) => a -> [a] -> Boolean
elem x xs = x `elemIndex` xs >= 0
