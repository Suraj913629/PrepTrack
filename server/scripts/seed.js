require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Sheet = require('../src/models/Sheet');
const Topic = require('../src/models/Topic');
const Question = require('../src/models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/preptrack';

const TOPICS = [
  'Arrays',
  'Strings',
  'Linked List',
  'Stack/Queue',
  'Binary Search',
  'Recursion',
  'DP',
  'Graphs',
];

const QUESTIONS_BY_TOPIC = {
  'Arrays': [
    { title: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { title: 'Contains Duplicate', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
    { title: 'Product of Array Except Self', difficulty: 'Medium', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { title: 'Maximum Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
    { title: 'Maximum Product Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
    { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { title: '3Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
    { title: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
    { title: 'Merge Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/' },
    { title: 'Minimum in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  ],
  'Strings': [
    { title: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
    { title: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
    { title: 'Longest Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/longest-palindrome/' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { title: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' },
    { title: 'Encode and Decode Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/encode-and-decode-strings/' },
    { title: 'Minimum Window Substring', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },
  ],
  'Linked List': [
    { title: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { title: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
    { title: 'Remove Nth Node From End', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
    { title: 'Reorder List', difficulty: 'Medium', link: 'https://leetcode.com/problems/reorder-list/' },
    { title: 'Copy List with Random Pointer', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
    { title: 'Merge K Sorted Lists', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  ],
  'Stack/Queue': [
    { title: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
    { title: 'Min Stack', difficulty: 'Easy', link: 'https://leetcode.com/problems/min-stack/' },
    { title: 'Implement Queue using Stacks', difficulty: 'Easy', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
    { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
    { title: 'Daily Temperatures', difficulty: 'Medium', link: 'https://leetcode.com/problems/daily-temperatures/' },
    { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
  ],
  'Binary Search': [
    { title: 'Binary Search', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search/' },
    { title: 'Search Insert Position', difficulty: 'Easy', link: 'https://leetcode.com/problems/search-insert-position/' },
    { title: 'Find First and Last Position', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
    { title: 'Search a 2D Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
    { title: 'Koko Eating Bananas', difficulty: 'Medium', link: 'https://leetcode.com/problems/koko-eating-bananas/' },
    { title: 'Minimum in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  ],
  'Recursion': [
    { title: 'Reverse String', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-string/' },
    { title: 'Fibonacci Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/fibonacci-number/' },
    { title: 'Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
    { title: 'Subsets', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets/' },
    { title: 'Combination Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum/' },
    { title: 'Permutations', difficulty: 'Medium', link: 'https://leetcode.com/problems/permutations/' },
  ],
  'DP': [
    { title: 'Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
    { title: 'House Robber', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/' },
    { title: 'Coin Change', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change/' },
    { title: 'Longest Increasing Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { title: 'Word Break', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break/' },
    { title: 'Unique Paths', difficulty: 'Medium', link: 'https://leetcode.com/problems/unique-paths/' },
    { title: 'Maximum Product Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
    { title: 'Edit Distance', difficulty: 'Hard', link: 'https://leetcode.com/problems/edit-distance/' },
  ],
  'Graphs': [
    { title: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
    { title: 'Clone Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
    { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
    { title: 'Course Schedule', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/' },
    { title: 'Graph Valid Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/graph-valid-tree/' },
    { title: 'Number of Connected Components', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
  ],
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    const adminHash = await bcrypt.hash('Admin@123', 12);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@preptrack.com' },
      {
        name: 'Admin',
        email: 'admin@preptrack.com',
        passwordHash: adminHash,
        role: 'admin',
      },
      { new: true, upsert: true }
    );
    console.log('Admin user ready:', admin.email);

    let sheet = await Sheet.findOne({ name: 'Striver A2Z' });
    if (!sheet) {
      sheet = await Sheet.create({
        name: 'Striver A2Z',
        description: 'Complete DSA sheet for placement preparation - Arrays, Strings, Linked List, Stack/Queue, Binary Search, Recursion, DP, Graphs.',
      });
      console.log('Sheet created: Striver A2Z');
    } else {
      console.log('Sheet exists: Striver A2Z');
    }

    const topicIdMap = {};
    for (const tName of TOPICS) {
      let topic = await Topic.findOne({ sheetId: sheet._id, name: tName });
      if (!topic) {
        topic = await Topic.create({ sheetId: sheet._id, name: tName });
        console.log('Topic created:', tName);
      }
      topicIdMap[tName] = topic._id;
    }

    let totalQ = 0;
    for (const [tName, questions] of Object.entries(QUESTIONS_BY_TOPIC)) {
      const topicId = topicIdMap[tName];
      for (const q of questions) {
        const exists = await Question.findOne({
          sheetId: sheet._id,
          topicId,
          title: q.title,
        });
        if (!exists) {
          await Question.create({
            sheetId: sheet._id,
            topicId,
            title: q.title,
            link: q.link || '',
            difficulty: q.difficulty || 'Medium',
          });
          totalQ++;
        }
      }
    }
    console.log('Questions created:', totalQ);

    const total = await Question.countDocuments();
    console.log('Total questions in DB:', total);

    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
