export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      areas: data.areas,
      hourlyRate: data.rate,
    };
    console.log(userId);
    const token = context.rootGetters.token;

    const response = await fetch(
      `https://coachfinder-vue-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` +
        token,
      {
        method: 'PUT',
        body: JSON.stringify(coachData),
      }
    );

    const resData = await response.json();
    console.log(resData);
    if (!response.ok) {
      // error
    }

    context.commit('registerCoach', {
      ...coachData,
      id: userId,
    });
  },

  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const response = await fetch(
      'https://coachfinder-vue-default-rtdb.firebaseio.com/coaches.json'
    );

    const resData = await response.json();
    if (!response.ok) {
      const error = new Error(resData.message || 'Failed to fetch.');
      throw error;
    }

    const coaches = [];
    for (const key in resData) {
      const coach = {
        id: key,
        firstName: resData[key].firstName,
        lastName: resData[key].lastName,
        description: resData[key].description,
        areas: resData[key].areas,
        hourlyRate: resData[key].hourlyRate,
      };
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches);
    context.commit('setFetchTimestamp');
  },
};
