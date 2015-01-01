module Grid where

import Control.Monad.Eff
import Control.Monad.Eff.Random
import Data.Maybe
import Data.Array
import Data.Foldable
import qualified Data.Set as S
import Math

data Artifact = Mine
              | Hint Number

type Rows = Number
type Columns = Number

data Coords = Coords Number Number
data Dimensions = Dimensions Rows Columns

data Cell = Cell
            { coords :: Coords
            , value :: Maybe Artifact
            }

data Grid = Grid
            { dimensions :: Dimensions
            , cells :: [Cell]
            }

type MS a = forall eff. Eff (random :: Random | eff) a

instance eqCoords :: Eq Coords where
  (==) (Coords x y) (Coords x' y') = x == x' && y == y'
  (/=) coords coords' = not $ coords == coords'

instance ordCoords :: Ord Coords where
  compare (Coords x y) (Coords x' y') | x == x'   = compare y y'
  compare (Coords x y) (Coords x' y') | otherwise = compare x x'


emptyGrid :: Dimensions -> Grid
emptyGrid dims = Grid { dimensions: dims
                      , cells: (emptyCells dims)
                      }

emptyCells :: Dimensions -> [Cell]
emptyCells (Dimensions rows columns) = concat $ do
  x <- (1..rows)
  y <- (1..columns)
  return [Cell { coords: (Coords x y), value: Nothing }]

layMines :: Number -> Grid -> MS Grid
layMines n grid = do
  xs <- randomCoords n grid
  return $ layMines' grid xs
  where
    layMines' grid (x:xs) =
      layMines' (updateCell x (Cell{ coords: x, value: (Just Mine)}) grid) xs
    layMines' grid [] = grid

placeHints :: Grid -> Grid
placeHints grid = foldl updateHints grid $ minedCells grid
  where
    updateHints :: Grid -> Cell -> Grid
    updateHints grid (Cell { coords = coords }) =
      foldl updateHint grid $ surroundingCells coords grid

    updateHint :: Grid -> Cell -> Grid
    updateHint grid (Cell { value = (Just Mine) }) = grid
    updateHint grid cell@(Cell { coords = coords, value = Nothing }) =
      updateCell coords (updateValue cell (Just (Hint 1))) grid
    updateHint grid cell@(Cell { coords = coords, value = (Just (Hint n)) }) =
      updateCell coords (updateValue cell (Just (Hint (1+n)))) grid


updateValue :: Cell -> Maybe Artifact -> Cell
updateValue (Cell { coords = coords }) artifact  =
  Cell { coords: coords, value: artifact }

updateCell :: Coords -> Cell -> Grid -> Grid
updateCell coords cell (Grid { dimensions = dims, cells = cells }) =
  Grid { dimensions: dims
       , cells: updateAt (cellIdx dims coords) cell cells
       }

randomCoords :: Number -> Grid -> MS [Coords]
randomCoords count (Grid {dimensions = dims}) = randomCoords' count dims []
  where
    randomCoords' :: Number -> Dimensions -> [Coords] -> MS [Coords]
    randomCoords' count _ xs                              | length xs == count =
      return xs
    randomCoords' count dims@(Dimensions rows columns) xs | otherwise = do
      x <- randomInt rows
      y <- randomInt columns
      randomCoords' count dims (nub (snoc xs (Coords x y)))

minedCells :: Grid -> [Cell]
minedCells (Grid { cells = cells }) = filter mined cells

unminedCells :: Grid -> [Cell]
unminedCells (Grid { cells = cells }) = filter unmined cells

neighbor :: Coords -> Cell -> Boolean
neighbor coords (Cell { coords = candidate }) =
  S.member candidate $ S.fromList (surroundingCoords coords)

mined :: Cell -> Boolean
mined (Cell { value = (Just Mine) }) = true
mined _                              = false

unmined :: Cell -> Boolean
unmined = not <<< mined

surroundingCells :: Coords -> Grid -> [Cell]
surroundingCells coords (Grid { cells = cells }) =
  filter (neighbor coords) cells

surroundingCoords :: Coords -> [Coords]
surroundingCoords (Coords x y) = map (applyDeltas) coordinateDeltas
  where
    coordinateDeltas :: [[(Number -> Number)]]
    coordinateDeltas = [[sub1,   id], [(+)1,   id]
                       ,[id  , sub1], [id,   (+)1]
                       ,[sub1, sub1], [(+)1, (+)1]
                       ,[sub1, (+)1], [(+)1, sub1]
                       ]
    applyDeltas :: [(Number -> Number)] -> Coords
    applyDeltas [fnX, fnY] = Coords (fnX x) (fnY y)

randomInt :: Number -> MS Number
randomInt max = do
  i <- random
  return $ 1 + (floor (i * max))

cellIdx :: Dimensions -> Coords -> Number
cellIdx (Dimensions rows columns) (Coords x y) =
  (x - 1) * columns + y - 1

sub1 :: Number -> Number
sub1 = flip (-) 1
