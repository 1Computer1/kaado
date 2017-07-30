class Provider {
    constructor(table, dataKey) {
        this.table = table;
        this.dataKey = dataKey;
        this.items = new Map();
    }

    async init() {
        const data = await this.table.findAll();
        for (const row of data) {
            this.items.set(row.id, row[this.dataKey]);
        }
    }

    get(id, key, defaultValue) {
        id = id || 'default';
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            if (value == null) return defaultValue;
            return value;
        }

        return defaultValue;
    }

    set(id, key, value) {
        id = id || 'default';
        const data = this.items.get(id) || {};
        data[key] = value;

        this.items.set(id, data);

        return this.table.upsert({
            id,
            [this.dataKey]: data
        });
    }

    delete(id, key) {
        id = id || 'default';
        const data = this.table.get(id) || {};
        delete data[key];

        return this.table.upsert({
            id,
            [this.dataKey]: data
        });
    }

    clear(id) {
        id = id || 'default';
        this.items.delete(id);
        return this.table.destroy({ where: { id } });
    }
}

module.exports = Provider;
