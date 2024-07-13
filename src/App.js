import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=489480",
    balance: -7,
  },
  {
    id: 933372,
    name: "john",
    image: "https://i.pravatar.cc/48?u=433347",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [openFriend, setOpenFriend] = useState(false);
  const [friends, setfriends] = useState([...initialFriends]);
  const [selected, setSelected] = useState(null);
  function handelAddedFriends(friend) {
    setfriends((f) => [...f, friend]);
    setOpenFriend(false);
  }

  function handelSelected(friend) {
    setSelected(friend.id === selected?.id ? null : friend);
    setOpenFriend(false);
  }

  function handelSplit(balance) {
    setfriends((curr) =>
      curr.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: balance + friend.balance }
          : friend
      )
    );
    setSelected(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          selected={selected}
          onSelect={handelSelected}
          friends={friends}
        />
        {openFriend && <FormAddFriend onAddFriends={handelAddedFriends} />}
        <Button handelFunction={() => setOpenFriend((o) => !o)}>
          {openFriend ? "close" : "Add friend"}
        </Button>
      </div>
      {selected && (
        <FormSplitBill
          key={selected.id}
          onSplit={handelSplit}
          selectedObj={selected}
        />
      )}
    </div>
  );
}

function FriendList({ friends, selected, onSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          selected={selected}
          friend={friend}
          onSelect={onSelect}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selected }) {
  const iSelected = selected?.id === friend.id;
  return (
    <li className={iSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>You and your {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} $
        </p>
      )}
      <Button handelFunction={() => onSelect(friend)}>
        {iSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setFriendName] = useState("");
  const [image, setImageUrl] = useState("https://i.pravatar.cc/48?=");

  function handelAddFriend(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}${id}`,
      balance: 0,
    };
    onAddFriends(newFriend);
    setFriendName("");
    setImageUrl("https://i.pravatar.cc/48?=");
  }
  return (
    <form onSubmit={handelAddFriend} className="form-add-friend">
      <label>👨‍👦‍👦 Friend name</label>
      <input
        onChange={(e) => setFriendName(e.target.value)}
        value={name}
        type="text"
        required
      />
      <label>🤳 Image URL</label>
      <input
        onChange={(e) => setImageUrl(e.target.value)}
        value={image}
        type="text"
        required
      />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, handelFunction }) {
  return (
    <button onClick={handelFunction} className="button">
      {children}
    </button>
  );
}

function FormSplitBill({ selectedObj, onSplit }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const friendExpens = bill ? bill - myExpense : "";
  const [whoPay, setWhopay] = useState("You");

  function handelSubmit(e) {
    const balance = whoPay === "You" ? friendExpens : -myExpense;
    e.preventDefault();
    onSplit(balance);
  }

  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split a bill with {selectedObj.name}</h2>

      <label>💰 Bill value</label>
      <input
        onChange={(e) => setBill(+e.target.value)}
        value={bill}
        type="text"
        required
      />
      <label>💁‍♂️ Your expense</label>
      <input
        onChange={(e) =>
          setMyExpense(+e.target.value > bill ? myExpense : +e.target.value)
        }
        value={myExpense}
        type="text"
      />
      <label>👨‍👦‍👦 {selectedObj.name}'s expense</label>
      <input value={friendExpens} type="text" disabled />
      <label>🙋‍♂️ Who is paying the bill?</label>
      <select onChange={(e) => setWhopay(e.target.value)} value={whoPay}>
        <option value="You">You</option>
        <option value="Friend Name">{selectedObj.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
